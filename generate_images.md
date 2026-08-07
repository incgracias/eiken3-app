# Chapter07 Image Generator (001–030)

## Goal

Generate vocabulary illustration cards for the EIKEN Grade 3 app.

Read `data/chapter07.js`.

Generate images for vocabulary No.001 through No.030 only.

Save every PNG into

images/chapter07/

Do not modify any source code.

---

## Output Files

Generate exactly these files.

001_accident.png
002_actor.png
003_adult.png
004_area.png
005_both.png
006_bottom.png
007_circle.png
008_click.png
009_clothes.png
010_cloud.png
011_cousin.png
012_culture.png
013_date.png
014_direction.png
015_doll.png
016_end.png
017_environment.png
018_event.png
019_exam.png
020_exercise.png
021_fact.png
022_factory.png
023_farewell.png
024_farm.png
025_flavor.png
026_flight.png
027_forest.png
028_fun.png
029_goal.png
030_grade.png

---

## Read Data

For each vocabulary item, read from `data/chapter07.js`:

- English word
- Example sentence
- Japanese meaning (for understanding only)

Do not display Japanese anywhere in the image.

---

## Image Specification

Size

1024 × 1024 PNG

Background

Pure white

Card

Rounded corners

Thin gray border

Flat modern educational style

No watermark

No logo

No shadow

Same design for every image.

---

## Layout

### Top

A white speech bubble.

Display only the English example sentence.

Large readable font.

---

### Center

A large colorful illustration representing the vocabulary.

The illustration must immediately communicate the meaning of the word.

Suitable for elementary and junior high school students.

Friendly.

Safe.

Educational.

---

### Bottom

White vocabulary strip.

Display ONLY

English vocabulary word

Bold

Centered

Do not display

- Japanese
- IPA
- Pronunciation
- Word number
- Grammar
- Explanation

---

## Illustration Rules

Create illustrations that are

- simple
- colorful
- cheerful
- educational

Never generate

- blood
- injury
- horror
- violence
- weapons
- political symbols
- sexual content

For "accident", show only a minor traffic accident with surprised people.

Never depict injuries.

---

## Processing

Repeat until all 30 images have been generated.

Do not stop after the first image.

Continue automatically.

If one image fails,

retry only that image,

then continue.

---

## Completion

When finished,

report

Completed 30 / 30 images.