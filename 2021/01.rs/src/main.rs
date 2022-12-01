use std::fs::File;
use std::io::{prelude::*, BufReader};

fn part_a(path: &str) -> usize {
    let file = File::open(path).expect("cannot open file");

    let reader = BufReader::new(&file);

    let mut count: usize = 0;
    let mut previous_value: usize = 0;

    let mut is_first = true;

    for line in reader.lines() {
        let value: usize = line.unwrap().parse().unwrap();

        if is_first {
            is_first = false;
            previous_value = value;
            continue;
        }

        if value > previous_value {
            count += 1;
        }

        previous_value = value;
    }

    return count;
}

fn part_b(path: &str) -> usize {
    let file = File::open(path).expect("cannot open file");

    let reader = BufReader::new(&file);
    let mut numbers: Vec<usize> = Vec::new();
    let mut count: usize = 0;

    for line in reader.lines() {
        let value: usize = line.unwrap().parse().unwrap();
        numbers.push(value);

        let i = numbers.len() - 1;

        if i < 3 {
            continue;
        }

        let a1 = numbers[i - 3];
        let a2 = numbers[i - 2];
        let a3 = numbers[i - 1];

        let b1 = numbers[i - 2];
        let b2 = numbers[i - 1];
        let b3 = numbers[i];

        let prev = a1 + a2 + a3;
        let curr = b1 + b2 + b3;

        if curr > prev {
            count += 1;
        }
    }

    return count;
}

fn main() {
    println!("PartA! {}", part_a("../01.txt"));
    println!("PartB! {}", part_b("../01.txt"));
}
