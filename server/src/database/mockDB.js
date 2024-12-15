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
            "Name0",
            "Description0",
            "https://seeklogo.com/images/T/the-project-logo-6082FFB8D5-seeklogo.com.png",
            db.domains[0].id,
            db.licenses[0].id,
            db.languages[0].id
        ),
        "2024-12-12T12:00:00",
        "2025-02-14T12:00:00",
        1000
    ),

    new Lot(
        "d984e8cb-a11f-468b-a008-f698c21c463c",
        new Project(
            "Name1",
            "Description1",
            "https://seeklogo.com/images/T/the-project-logo-6082FFB8D5-seeklogo.com.png",
            db.domains[1].id,
            db.licenses[1].id,
            db.languages[1].id
        ),
        "2024-12-12T12:00:00",
        "2025-02-14T12:00:00",
        1000
    ),

    new Lot(
        "281ed63c-e3a9-476f-bed8-92b219444e79",
        new Project(
            "Name2",
            "Description2",
            "https://seeklogo.com/images/T/the-project-logo-6082FFB8D5-seeklogo.com.png",
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
            "Name3",
            "Description3",
            "https://seeklogo.com/images/T/the-project-logo-6082FFB8D5-seeklogo.com.png",
            db.domains[2].id,
            db.licenses[2].id,
            db.languages[2].id
        ),
        "2024-12-12T12:00:00",
        "2024-12-12T13:00:00",
        1000
    ),
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