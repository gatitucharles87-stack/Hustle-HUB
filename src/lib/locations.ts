
export type Location = {
    name: string;
    sub_counties: {
        name: string;
        areas: string[];
    }[];
};

export const counties: Location[] = [
    {
        name: "Nairobi",
        sub_counties: [
            {
                name: "Westlands",
                areas: ["Kitisuru", "Parklands", "Highridge", "Kangemi", "Mountain View"],
            },
            {
                name: "Dagoretti",
                areas: ["Kawangware", "Gatina", "Kileleshwa", "Kilimani"],
            },
            {
                name: "Kasarani",
                areas: ["Roysambu", "Githurai", "Kahawa West", "Zimmerman", "Kasarani"],
            },
            {
                name: "Embakasi",
                areas: ["Utawala", "Imara Daima", "Pipeline", "Donholm"],
            },
             {
                name: "Lang'ata",
                areas: ["Karen", "South C", "Nairobi West", "Madaraka"],
            },
        ],
    },
    {
        name: "Mombasa",
        sub_counties: [
            {
                name: "Mvita",
                areas: ["Ganjoni", "Tudor", "Majengo", "Old Town"],
            },
            {
                name: "Kisauni",
                areas: ["Nyali", "Bamburi", "Shanzu", "Mtwapa"],
            }
        ],
    },
    {
        name: "Kisumu",
        sub_counties: [
            {
                name: "Kisumu Central",
                areas: ["Milimani", "Nyalenda", "Kondele", "Manyatta"],
            },
            {
                name: "Kisumu West",
                areas: ["Maseno", "Ojolla"],
            }
        ]
    }
];
