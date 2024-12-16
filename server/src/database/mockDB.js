import {User} from '../models/user.js';
import {Bid} from "../models/bid.js";
import {Domain} from "../models/domain.js";
import {Language} from "../models/language.js";
import {License} from "../models/license.js"
import {Lot} from "../models/lot.js";
import {Project} from "../models/project.js";


export const db = {
    domains: [],
    languages: [],
    licenses: [],
    users: [],
    lots: [],
    bids: []
}

db.domains.push(
    new Domain(0, "AI"),
    new Domain(1, "Cloud Migration"),
    new Domain(3, "Android development"),
)

db.languages.push(
    new Language(0,"Python"),
    new Language(1,"Java"),
    new Language(2,"JavaScript"),
)

db.licenses.push(
    new License(0,"MIT"),
    new License(1,"Apache-2.0"),
    new License(2,"BSD-2-Clause"),
)

db.users.push(
    new User(0,"admin@gmail.com", "Password123!", true),
    new User(1,"user1@gmail.com", "Password123!", false),
    new User(2,"user2@gmail.com", "Password123!", false),
)

db.lots.push(

    new Lot(
        "d9db83b4-d974-4c30-88bd-0bff9aa7dd46",
        new Project(
            "AI-Powered Code Reviewer",
            "An AI-driven tool that automatically reviews and suggests optimizations for your codebase. Designed for Python projects.",
            "https://seeklogo.com/images/T/the-project-logo-6082FFB8D5-seeklogo.com.png",
            db.domains[0].id,
            db.licenses[0].id,
            db.languages[0].id
        ),
        "2024-12-12T12:00:00",
        "2025-02-14T12:00:00",
        1005
    ),

    new Lot(
        "d984e8cb-a11f-468b-a008-f698c21c463c",
        new Project(
            "Cloud Data Migrator",
            "A seamless cloud migration tool that automates moving large datasets to AWS or Azure with zero downtime.",
            "https://soszeropol2030.eu/wp-content/uploads/2023/12/zeropol_logo_vertical.png",
            db.domains[1].id,
            db.licenses[1].id,
            db.languages[1].id
        ),
        "2024-12-12T12:00:00",
        "2025-02-14T12:00:00",
        1001
    ),

    new Lot(
        "281ed63c-e3a9-476f-bed8-92b219444e79",
        new Project(
            "Mobile Health Tracker",
            "A health-tracking Android application that integrates with wearable devices and provides real-time health analytics.",
            "https://upload.wikimedia.org/wikipedia/commons/a/a8/The_Shift_Project_Logo_small_bleu.png",
            db.domains[2].id,
            db.licenses[2].id,
            db.languages[2].id
        ),
        "2024-12-12T12:00:00",
        "2025-02-14T12:00:00",
        1000
    ),

    new Lot(
        "6b70425a-d0ab-4f4c-a091-1d0356e7bc41",
        new Project(
            "Real-Time Auction Platform",
            "A real-time bidding platform that allows multiple users to place bids concurrently. Built for scalability and speed.",
            "https://i.pinimg.com/originals/cf/8a/70/cf8a70264efe1c12522359db0501c99f.png",
            db.domains[2].id,
            db.licenses[2].id,
            db.languages[2].id
        ),
        "2024-12-12T12:00:00",
        "2024-12-12T13:00:00",
        1001
    ),

    new Lot(
        "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        new Project(
            "Virtual Reality Learning Platform",
            "A VR-based interactive learning platform that makes education more engaging and immersive for students of all ages.",
            "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f7bbdc61566177.5a72772c66380.png",
            db.domains[0].id,
            db.licenses[1].id,
            db.languages[2].id
        ),
        "2024-12-12T12:00:00",
        "2025-01-20T12:00:00",
        1500
    ),

    new Lot(
        "f1e2d3c4-b5a6-7890-bcde-ef6543210987",
        new Project(
            "Decentralized Voting System",
            "A blockchain-based voting system designed for transparent and tamper-proof elections with complete anonymity.",
            "https://gendercool.org/wp-content/uploads/2021/03/GenderCool-logo-retina.png",
            db.domains[1].id,
            db.licenses[2].id,
            db.languages[1].id
        ),
        "2024-12-12T12:00:00",
        "2025-03-10T12:00:00",
        2000
    ),

    new Lot(
        "1a2b3c4d-e5f6-7890-abcd-ef0987654321",
        new Project(
            "AI-Driven Resume Analyzer",
            "An AI tool that scans resumes and provides suggestions to increase hiring chances based on industry standards.",
            "https://galaxyproject.org/images/galaxy-logos/galaxy_project_logo_square.png",
            db.domains[2].id,
            db.licenses[0].id,
            db.languages[0].id
        ),
        "2024-12-12T12:00:00",
        "2025-02-25T12:00:00",
        1200
    ),

    new Lot(
        "12345678-90ab-cdef-1234-567890abcdef",
        new Project(
            "Machine Learning Model Hub",
            "A marketplace for buying, selling, and sharing machine learning models with pre-trained weights for developers.",
            "https://cdn.dribbble.com/userupload/3056293/file/original-65c21f6c47764539a687489ffeb0df8e.png",
            db.domains[0].id,
            db.licenses[1].id,
            db.languages[1].id
        ),
        "2024-12-12T12:00:00",
        "2025-01-28T12:00:00",
        1800
    ),

    new Lot(
        "abcd1234-5678-90ab-cdef-1234567890ab",
        new Project(
            "Open Source SaaS Boilerplate",
            "A SaaS starter kit with user authentication, subscription management, and a modular architecture ready to deploy.",
            "https://cdn.shopify.com/s/files/1/1095/6418/files/a2d5308c1ecc6ab.png?v=1668262258",
            db.domains[1].id,
            db.licenses[2].id,
            db.languages[0].id
        ),
        "2024-12-12T12:00:00",
        "2025-01-18T12:00:00",
        1100
    ),

    new Lot(
        "abcd5678-1234-90ab-cdef-0987654321ef",
        new Project(
            "IoT Smart Home System",
            "A plug-and-play IoT smart home system for controlling lights, appliances, and security devices via a mobile app.",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/NuGet_project_logo.svg/512px-NuGet_project_logo.svg.png",
            db.domains[2].id,
            db.licenses[0].id,
            db.languages[2].id
        ),
        "2024-12-12T12:00:00",
        "2025-02-05T12:00:00",
        2500
    )
)

db.bids.push(
    new Bid(
        "9a90f3eb-04ad-4a51-8960-5ff5e5c96f24",
        "2024-12-12T12:10:00",
        db.lots[0].id,
        db.users[1].id,
        1003
    ),

    new Bid(
        "9a90f3eb-04ad-4a51-8960-5ff5e5c96f25",
        "2024-12-12T12:10:00",
        db.lots[0].id,
        db.users[2].id,
        1005
    ),

    new Bid(
        "37ffaac0-d66b-4c5b-84af-55f0808f24d6",
        "2024-12-12T12:10:00",
        db.lots[1].id,
        db.users[1].id,
        1001
    ),
    new Bid(
        "f5f867ef-041f-491d-b9d3-57fdc740fc96",
        "2024-12-12T12:10:00",
        db.lots[3].id,
        db.users[1].id,
        1001
    ),
)