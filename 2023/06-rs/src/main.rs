use std::fs::File;
use std::io::{BufRead, BufReader};

fn get_numbers(line: String) -> Vec<u32> {
    return line
        .trim_start()
        .split(" ")
        .filter(|s| s.to_string() != "")
        .map(|f| f.parse::<u32>().unwrap())
        .collect();
}

fn compute_part_1(path: &str) -> u32 {
    let file = File::open(path).unwrap();
    let reader = BufReader::new(file);

    let lines: Vec<String> = reader.lines().map(|line| line.unwrap()).collect();

    let times = get_numbers(lines.get(0).unwrap().replace("Time:", ""));
    let distances = get_numbers(lines.get(1).unwrap().replace("Distance:", ""));

    dbg!(times);
    dbg!(distances);

    return 1;
}

fn main() {
    compute_part_1("input.txt");
    println!("Hello, world!");
}
