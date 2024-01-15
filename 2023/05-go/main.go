package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Transform struct {
	dest      int
	source    int
	range_len int
}

type Action struct {
	from       string
	to         string
	transforms []Transform
}

func parse_action(content string) *Action {
	lines := strings.Split(content, "\n")

	title_items := strings.Split(strings.Replace(lines[0], " map:", "", -1), "-to-")

	a := Action{
		from:       title_items[0],
		to:         title_items[1],
		transforms: []Transform{},
	}

	for _, line := range lines[1:] {
		numbers := parse_numbers(line)
		a.transforms = append(a.transforms, Transform{
			dest:      numbers[0],
			source:    numbers[1],
			range_len: numbers[2],
		})
	}

	return &a
}

func parse_numbers(line string) []int {
	numbers := []int{}

	for _, n := range strings.Split(line, " ") {
		i, err := strconv.Atoi(n)
		if err != nil {
			panic(fmt.Sprintf("Cannot transform %s", n))
		}
		numbers = append(numbers, i)
	}

	return numbers
}

func parse_input(file string) (seeds []int, actions []Action) {
	data, err := os.ReadFile(file)

	if err != nil {
		panic(err)
	}

	groups := strings.Split(string(data), "\n\n")

	for _, lines := range groups[1:] {
		action := parse_action(lines)
		actions = append(actions, *action)
	}

	seeds = parse_numbers(strings.Replace(groups[0], "seeds: ", "", -1))

	return
}

func transform(transforms []Transform, seed int) int {
	for _, t := range transforms {
		if seed >= t.source && seed < t.source+t.range_len {
			return seed + (t.dest - t.source)
		}
	}

	return seed
}

func lowest(numbers []int) int {
	min := -1
	for _, n := range numbers {
		if min == -1 || min > n {
			min = n
		}
	}
	return min
}

func part_a(file string) int {
	seeds, actions := parse_input(file)
	for _, action := range actions {
		for i, seed := range seeds {
			seeds[i] = transform(action.transforms, seed)
		}
	}
	return lowest(seeds)
}

func expand_seeds(seeds []int, callback func(int)) {
	for i := 0; i < len(seeds); i += 2 {
		from := seeds[i]
		to := from + seeds[i+1]

		fmt.Println("expand seeds", from, to)

		for i := from; i <= to; i++ {
			callback(i)
		}
	}
}

func part_b(file string) int {
	seeds, actions := parse_input(file)

	min := -1

	expand_seeds_callback := func(seed int) {
		for _, action := range actions {
			seed = transform(action.transforms, seed)
		}
		if min == -1 || min > seed {
			min = seed
		}
	}

	expand_seeds(seeds, expand_seeds_callback)

	return min
}

func part_b_async(file string) int {
	seeds, actions := parse_input(file)

	c := make(chan int)

	go_counts := 0

	expand_seeds_callback := func(seed int) {
		go_counts += 1
		go func() {
			for _, action := range actions {
				seed = transform(action.transforms, seed)
			}
			c <- seed
		}()
	}

	expand_seeds(seeds, expand_seeds_callback)

	min := -1

	for i := 0; i < go_counts; i++ {
		seed := <-c
		if min == -1 || min > seed {
			min = seed
		}
	}

	return min
}

// checks that value is equal, or panic.
func assert_equals(value, expect int) {
	if value != expect {
		panic(fmt.Sprintf("should be %d, got %d", expect, value))
	}
}

func main() {
	assert_equals(part_a("spec.txt"), 35)
	fmt.Println(part_a("input.txt"))

	assert_equals(part_b("spec.txt"), 46)
	fmt.Println(part_b("input.txt"))
}

// GO seq: 2.4mb - 144s
// nodejs: 18.5mb -
