use std::fs::File;
use std::io::{BufRead, BufReader};

fn get_number(line: String) -> u32 {
    let a: Vec<u32> = line
        .chars()
        .filter(|c| c.is_ascii_digit())
        .map(|c| c.to_digit(10).unwrap())
        .collect();

    return a.first().unwrap() * 10 + a.last().unwrap();
}

fn compute_part_1(path: &str) -> u32 {
    let file = File::open(path).unwrap();
    let reader = BufReader::new(file);

    return reader
        .lines()
        .map(|line| line.unwrap())
        .map(|line| get_number(line))
        .sum::<u32>();
}

fn get_number_with_words(line: String) -> u32 {
    let chars = line.chars();
    let mut first = 0;
    let mut last = 0;

    let mut apply_nb = |nb: u32| {
        if first == 0 {
            first = nb;
        };
        last = nb;
    };

    for (i, c) in chars.enumerate() {
        if c.is_ascii_digit() {
            let digit = c.to_digit(10).unwrap();
            apply_nb(digit);
            continue;
        }
        let words = vec![
            "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        ];

        for (j, word) in words.iter().enumerate() {
            let to = word.len() + i;
            if to > line.len() {
                continue;
            }

            let sub = line[i..(word.len() + i)].to_string();

            if sub == word.to_string() {
                apply_nb((j + 1) as u32);
                break;
            }
        }
    }

    return first * 10 + last;
}

fn compute_part_2(path: &str) -> u32 {
    let file = File::open(path).unwrap();
    let reader = BufReader::new(file);

    return reader
        .lines()
        .map(|line| line.unwrap())
        .map(|line| get_number_with_words(line))
        .sum::<u32>();
}

fn main() {
    let part1 = compute_part_1("../01/input.txt");
    assert_eq!(part1, 55712);
    println!("part 1: {}", part1);

    let part2 = compute_part_2("../01/input.txt");
    assert_eq!(part2, 55413);
    println!("part 1: {}", part2);
}

#[cfg(test)]
mod tests {
    use crate::{compute_part_1, compute_part_2, get_number, get_number_with_words};

    #[test]
    fn test_get_number() {
        assert_eq!(get_number(String::from("a1b2c3d4e5f")), 15);
    }

    #[test]
    fn test_spec_file() {
        assert_eq!(compute_part_1("../01/spec.txt"), 142);
        assert_eq!(compute_part_2("../01/spec.txt"), 281);
    }

    #[test]
    fn test_get_number_with_words() {
        assert_eq!(get_number_with_words(String::from("two3two")), 22);
    }
}
