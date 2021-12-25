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

fn main() {
    println!("PartA! {}", part_a("../01.txt"));
}
