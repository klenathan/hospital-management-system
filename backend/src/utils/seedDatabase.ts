import { faker } from "@faker-js/faker";

// const DEPARTMENTS = ["Cardiology", "Neurology", "Pediatrics", "Emergency"];

const JOB_TYPES = ["Doctor", "Nurse", "Admin"];

const QUALIFICATIONS = [
  "Qualification Type 1",
  "Qualification Type 2",
  "Qualification Type 3",
];

export function createRandomStaff(index: number) {
  return `(${index}, '${faker.person.firstName()}', '${faker.person
    .lastName()
    .replace("'", "")}', '${
    JOB_TYPES[Math.floor(Math.random() * JOB_TYPES.length)]
  }', '${
    QUALIFICATIONS[Math.floor(Math.random() * QUALIFICATIONS.length)]
  }', ${Math.floor(Math.random() * 5)}, ${
    (Math.floor(Math.random() * 100) + 10) * 1000000
  })`;
}

const staffResult: string[] = [];
for (let i = 0; i < 200; i++) {
  staffResult.push(createRandomStaff(i + 1));
}

export function createRandomPatients(index: number) {
  return `(${index}, '${faker.person
    .firstName()
    .replace("'", "")}', '${faker.person.firstName().replace("'", "")}', '${
    faker.date
      .birthdate({ min: 18, max: 65, mode: "age" })
      .toISOString()
      .split("T")[0]
  }', '${faker.phone.number()}', '${faker.location
    .streetAddress(false)
    .replace("'", "")}', '${"allergies hehe"}')`;
}

// const patients: string[] = [];
// for (let i = 0; i < 2000; i++) {
//   patients.push(createRandomPatients(i + 1));
// }

// console.log(patients);

import * as fs from "fs";

// const patientsInsert = `
// INSERT IGNORE INTO patients (
//   id,
//   first_name,
//   last_name,
//   date_of_birth,
//   contact_info,
//   address,
//   allergies
// )
// values ${patients.join(", \n")};
//         `;

const staffsInsert = `
INSERT IGNORE INTO staffs (
  id,
  first_name,
  last_name,
  job_type,
  qualifications,
  department_id,
  salary
)
values ${staffResult.join(", \n")};
        `;

fs.writeFile("./test.sql", staffsInsert, (err: any) => {
  if (err) {
    console.error("Error writing to file:", err);
    return;
  }
  console.log("File has been written successfully.");
});
