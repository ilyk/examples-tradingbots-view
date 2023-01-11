const names = [
    "Flat",
    "Lowest to Highest",
    "Highest to Lowest",
]
export const Distribution = {
    Flat: 0,
    LowestToHighest: 1,
    HighestToLowest: 2,

    values: () => [
        Distribution.Flat,
        Distribution.LowestToHighest,
        Distribution.HighestToLowest,
    ],
    getValue: (i: Distribution) => names[i]
}
