package main

import (
	"fmt"
	"math"
)

func countDigits(i int) int {
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
		digits_count += countDigits(number)
	}

	return result
}

func main() {
	fmt.Println(sliceToInt([]int{12, 34, 56}))
	fmt.Println(sliceToInt([]int{12, 3456}))
	fmt.Println(sliceToInt([]int{1, 2, 3, 4, 5, 6}))
}
