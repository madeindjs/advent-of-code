use std::fs::File;
use std::io::{prelude::*, BufReader};

enum Direction {
    Forward,
    Down,
    Up,
}

struct Move {
    direction: Direction,
    qty: usize,
}

struct Position {
    horizontal: usize,
    depth: usize,
}

struct Position2 {
    horizontal: usize,
    depth: usize,
    aim: usize,
}

fn get_move(path: &str) -> Vec<Move> {
    let file = File::open(path).expect("cannot open file");

    let reader = BufReader::new(&file);

    let mut moves: Vec<Move> = Vec::new();

    for line in reader.lines() {
        let line = line.unwrap();

        let parts: Vec<&str> = line.split(" ").collect();
        assert_eq!(2, parts.len());

        let direction = match parts[0] {
            "up" => Direction::Up,
            "down" => Direction::Down,
            "forward" => Direction::Forward,
            _ => panic!(""),
        };
        let qty: usize = parts[1].parse().unwrap();

        moves.push(Move {
            direction: direction,
            qty: qty,
        });
    }

    return moves;
}

fn part_a(path: &str) -> usize {
    let mut position = Position {
        horizontal: 0,
        depth: 0,
    };

    for movement in get_move(path).iter() {
        match movement.direction {
            Direction::Forward => position.horizontal += movement.qty,
            Direction::Down => position.depth += movement.qty,
            Direction::Up => position.depth -= movement.qty,
        }
    }

    position.horizontal * position.depth
}

fn part_b(path: &str) -> usize {
    let mut position = Position2 {
        horizontal: 0,
        depth: 0,
        aim: 0,
    };

    for movement in get_move(path).iter() {
        match movement.direction {
            Direction::Forward => {
                position.horizontal += movement.qty;
                position.depth += position.aim * movement.qty;
            },
            Direction::Down => position.aim += movement.qty,
            Direction::Up => position.aim -= movement.qty,
        }
    }

    position.horizontal * position.depth
}

fn main() {
    println!("PartA! {:?}", part_a("../02.txt"));
    println!("PartB! {}", part_b("../02.txt"));
}
