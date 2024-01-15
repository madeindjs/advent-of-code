// Answer Advent of Code 2023-06. Expect to have a file `input.txt` & `spec.txt`.
package main

import (
	"fmt"
	"math"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type Race struct {
	time     int
	distance int
}

// ex: `CountDigits(123)` will return `3`
func CountDigits(i int) int {
	if i == 0 {
		return 1
	}
	count := 0
	for i != 0 {
		i /= 10
		count++
	}
	return count
}

// concatenate the integers into one int.
// Ex: `sliceToInt([]int{1,23,456})` will returns `123456`
func sliceToInt(ints []int) int {
	result := 0
	digits_count := 0

	getOffset := func() int {
		return int(math.Pow(10, float64(digits_count)))
	}

	for i := len(ints) - 1; i >= 0; i-- {
		number := ints[i]
		if digits_count == 0 {
			result += number
		} else {
			result += number * getOffset()
		}
		digits_count += CountDigits(number)
	}

	return result
}

func parseInput(file string, callback func(Race), merge bool) {
	data, err := os.ReadFile(file)
	checkErr(err)

	lines := strings.Split(string(data), "\n")

	timeRe := regexp.MustCompile(`Time: +`)
	times := parseNumbers(timeRe.ReplaceAllString(lines[0], ""))

	distanceRe := regexp.MustCompile(`Distance: +`)
	distances := parseNumbers(distanceRe.ReplaceAllString(lines[1], ""))

	if merge {
		callback(Race{time: sliceToInt(times), distance: sliceToInt(distances)})
	} else {
		for i, time := range times {
			callback(Race{time: time, distance: distances[i]})
		}
	}
}

func parseNumbers(line string) []int {
	re := regexp.MustCompile(" +")
	numbers := []int{}

	for _, n := range re.Split(line, -1) {
		i, err := strconv.Atoi(n)
		if err != nil {
			panic(fmt.Sprintf("Cannot transform %s", n))
		}
		numbers = append(numbers, i)
	}

	return numbers
}

func computeTime(holdMs int, distance int) int {
	return holdMs + distance/holdMs
}

func computeRace(race Race) int {
	total := 0
	for i := 1; i < race.time; i++ {
		time := computeTime(i, race.distance)
		if time < race.time {
			total += 1
		}
	}

	return total
}

func compute(file string, merge bool) int {
	total := 1
	parseInput(file, func(race Race) {
		total *= computeRace(race)
	}, merge)
	return total
}

func main() {
	fmt.Println("partA (spec): ", compute("spec.txt", false))
	fmt.Println("partA       : ", compute("input.txt", false))
	fmt.Println("partB (spec): ", compute("spec.txt", true))
	fmt.Println("partB       : ", compute("input.txt", true))
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
