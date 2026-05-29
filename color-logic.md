# Color Coding Logic

## Definitions

```
cal% = calories_consumed / calories_target
macro% = macro_value / macro_target  (for each of protein, carbs, fat, fibre)
```

## When cal% >= 0.75 (all elements colored the same way)

Applies to: calorie ring, protein, carbs, fat, fibre — each evaluated individually.

```
if value% between 0.75 and 0.89:
    color = yellow
else if value% between 0.90 and 1.10:
    color = green
else if value% > 1.10:
    color = red
```

## When cal% < 0.75 (early in the day)

### Calorie ring
```
color = light green
```

### Each macro bar
Compare macro% against cal% (is this macro keeping pace with your calorie intake?):

```
if macro% < cal% * 0.75 or macro% > cal% * 1.10:
    color = light red
else if macro% between cal% * 0.75 and cal% * 0.89:
    color = light yellow
else if macro% between cal% * 0.90 and cal% * 1.10:
    color = light green
```

## Colors

| Color        | Hex       | When used                          |
|--------------|-----------|-------------------------------------|
| Green        | `#34C759` | On target (cal% >= 0.75)           |
| Yellow       | `#FF9500` | Getting close (cal% >= 0.75)       |
| Red          | `#FF3B30` | Too low or over (cal% >= 0.75)     |
| Light green  | `#A8E6CF` | On pace (cal% < 0.75)              |
| Light yellow | `#FFE0A3` | Slightly off pace (cal% < 0.75)    |
| Light red    | `#FFB3B0` | Off pace (cal% < 0.75)             |
