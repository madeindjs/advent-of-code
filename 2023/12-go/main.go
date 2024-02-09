package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Line struct {
	schema string
	nbs    []uint64
}

func parseNumbers(line string) []uint64 {
	raw_nbs := strings.Split(line, ",")
	nbs := make([]uint64, len(raw_nbs))

	for i, raw := range raw_nbs {
		nb, err := strconv.ParseUint(raw, 10, 32)
		if err != nil {
			panic(err)
		}
		nbs[i] = nb
	}

	return nbs
}

func parseInput(file string) []Line {
	data, err := os.ReadFile(file)

	if err != nil {
		panic(err)
	}

	lines := []Line{}
	rows := strings.Split(string(data), "\n")

	for _, row := range rows {
		a := strings.Split(row, " ")
		lines = append(lines, Line{schema: a[0], nbs: parseNumbers(string(a[1]))})
	}

	return lines
}

func getPossibleLinesCounts(line Line, cache map[string]uint) uint {
	key := fmt.Sprintf("%s-%v", line.schema, line.nbs)

	if cached, ok := cache[key]; ok {
		return cached
	}

	if len(line.schema) == 0 {
		if len(line.nbs) == 0 {
			return 1
		} else {
			return 0
		}
	}

	if len(line.nbs) == 0 && !strings.ContainsRune(line.schema, '?') {
		if strings.ContainsRune(line.schema, '#') {
			return 0
		} else {
			return 1
		}
	}

	linesCount := uint(0)
	currentCount := uint64(0)

	for index, char := range line.schema {
		if char == '#' {
			currentCount++
		} else if char == '.' && currentCount != 0 {

			if len(line.nbs) == 0 || currentCount != line.nbs[0] {
				cache[key] = linesCount
				return uint(linesCount)
			} else {
				line.nbs = line.nbs[1:]
				currentCount = 0
			}

		} else if char == '?' {
			next := line.schema[index+1:]
			hashes := strings.Repeat("#", int(currentCount))

			linesCount += getPossibleLinesCounts(
				Line{schema: fmt.Sprintf("%s#%s", hashes, next), nbs: line.nbs},
				cache,
			)

			if currentCount != 0 {
				if len(line.nbs) == 0 || currentCount != line.nbs[0] {
					cache[key] = linesCount
					return linesCount
				} else {
					linesCount += getPossibleLinesCounts(Line{schema: next, nbs: line.nbs[1:]}, cache)
				}
			} else {
				linesCount += getPossibleLinesCounts(Line{schema: next, nbs: line.nbs}, cache)
			}

			cache[key] = linesCount
			return linesCount
		}
	}

	if currentCount != 0 {
		if len(line.nbs) == 0 || currentCount != uint64(line.nbs[0]) {
			cache[key] = 0
			return 0
		} else {
			line.nbs = line.nbs[1:]
			currentCount = 0
		}
	}

	if len(line.nbs) == 0 {
		linesCount++
	}

	cache[key] = linesCount

	return linesCount
}

func computeLines(lines []Line) uint {
	cache := make(map[string]uint)
	total := uint(0)
	for _, line := range lines {
		total += getPossibleLinesCounts(line, cache)
	}
	return total
}

func foldLines(lines []Line) []Line {
	newLines := []Line{}

	for _, line := range lines {
		schema := strings.Join([]string{line.schema, line.schema, line.schema, line.schema, line.schema}, "?")
		nbs := []uint64{}
		nbs = append(nbs, line.nbs...)
		nbs = append(nbs, line.nbs...)
		nbs = append(nbs, line.nbs...)
		nbs = append(nbs, line.nbs...)
		nbs = append(nbs, line.nbs...)

		newLines = append(newLines, Line{schema: schema, nbs: nbs})
	}

	return newLines
}

func main() {
	cache := make(map[string]uint)
	test1 := getPossibleLinesCounts(Line{schema: "???.###", nbs: []uint64{1, 1, 3}}, cache)
	if test1 != 1 {
		panic(fmt.Sprintf("Should be 1, was %d", test1))
	}

	fmt.Println("Main a (spec) ", computeLines(parseInput("spec.txt")))
	fmt.Println("Main a ", computeLines(parseInput("input.txt")))

	fmt.Println("Main b (spec) ", computeLines(foldLines(parseInput("spec.txt"))))
	fmt.Println("Main b ", computeLines(foldLines(parseInput("input.txt"))))
}
