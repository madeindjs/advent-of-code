package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func parse_line(line string) int {
	first := -1
	second := -1
	for _, r := range line {
		i, err := strconv.Atoi(string(r))

		if err != nil {
			continue
		} else if first == -1 {
			first = i
		}
		second = i

	}

	return first*10 + second
}

func parse_line_with_words(line string, words *[9]string) int {
	first := -1
	second := -1

	set_number := func(i int) {
		if first == -1 {
			first = i
		}
		second = i
		return
	}

	for i, r := range line {
		n, err := strconv.Atoi(string(r))

		if err == nil {
			set_number(n)
		} else {
			for word_i, word := range *words {
				slice_end := i + len(word)
				if slice_end > len(line) {
					continue
				}
				potential_word := line[i : i+len(word)]

				if potential_word == word {
					set_number(word_i + 1)
				}
			}
		}
	}

	return first*10 + second
}

func get_lines(file string) []string {
	data, err := os.ReadFile(file)

	if err != nil {
		panic(err)
	}

	return strings.Split(string(data), "\n")
}

type sum_callback func(string) int

func sum_using_callback(items []string, callback sum_callback) int {
	total := 0
	for _, line := range items {
		total += callback(line)
	}
	return total
}

func part_a(file string) int {
	return sum_using_callback(get_lines(file), parse_line)
}

func part_b(file string) int {
	words := [...]string{"one", "two", "three", "four", "five", "six", "seven", "eight", "nine"}

	callback := func(line string) int {
		return parse_line_with_words(line, &words)
	}

	return sum_using_callback(get_lines(file), callback)
}

func main() {
	if total := parse_line("two2and6"); total != 26 {
		panic("test")
	}

	if total := part_a("../01/spec.txt"); total != 142 {
		fmt.Println(total)
		panic("not (142)")
	}

	fmt.Println("Part a (spec)", part_a("../01/spec.txt"))
	fmt.Println("Part a", part_a("../01/input.txt"))
	fmt.Println("Part b (spec)", part_b("../01/spec.txt"))
	fmt.Println("Part b", part_b("../01/input.txt"))
}
