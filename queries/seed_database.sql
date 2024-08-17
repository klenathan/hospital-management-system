INSERT INTO Departments (name)
VALUES ('Cardiology'),
    ('Neurology'),
    ('Pediatrics'),
    ('Emergency');

INSERT IGNORE INTO Patients (
        id,
        first_name,
        last_name,
        date_of_birth,
        contact_info,
        address,
        allergies
    )
VALUES (
        2,
        'Duong',
        'Nguyen',
        '2000-08-18',
        'duongnguyen@gmail.com',
        '199 bach dang',
        'None'
    );

INSERT INTO Patients (
        first_name,
        last_name,
        date_of_birth,
        contact_info,
        address,
        allergies
    )
VALUES (
        'Duong',
        'Nguyen',
        '2000-08-18',
        'duongnguyen@gmail.com',
        '199 bach dang',
        'None'
    ),
    (
        'Minh',
        'Nguyen',
        '2005-05-11',
        'minhnguyen@gmail.com',
        '255 nam ky khoi nghia',
        'None'
    ),
    (
        'Hoang',
        'Dang',
        '1999-09-25',
        'hoangdang@gmail.com',
        '87 le van luong',
        'None'
    ),
    (
        'Patrik',
        'Bale',
        '1995-07-07',
        'patrikbale@gmail.com',
        '55 nguyen van linh',
        'None'
    );

INSERT INTO Staffs (
        first_name,
        last_name,
        job_type,
        qualifications,
        department_id,
        salary
    )
VALUES (
        'Dr. Peter',
        'Julian',
        'Doctor',
        'MD',
        1,
        40000000.00
    ),
    (
        'Dr. Phong',
        'Tran',
        'Doctor',
        'MD',
        2,
        35000000.00
    ),
    (
        'Yen',
        'Huynh',
        'Nurse',
        'BSN',
        3,
        20000000.00
    ),
    (
        'Hieu',
        'Pham',
        'Admin',
        'MBA',
        4,
        30000000.00
    );

INSERT INTO appointments (
        patient_id,
        staff_id,
        start_time,
        end_time,
        purpose
    )
VALUES (
        1,
        1,
        '2024-08-11 13:00:00',
        '2024-08-11 13:30:00',
        'General Checkup'
    ),
    (
        2,
        2,
        '2024-08-12 14:00:00',
        '2024-08-12 14:30:00',
        'Consulation'
    ),
    (
        3,
        3,
        '2024-08-14 09:00:00',
        '2024-08-14 09:30:00',
        'General Checkup'
    ),
    (
        1,
        2,
        '2024-08-18 10:00:00',
        '2024-08-18 10:30:00',
        'Emergency treatment'
    );

INSERT INTO treatments (
        patient_id,
        staff_id,
        treatment_date,
        treatment_details
    )
VALUES (
        1,
        1,
        '2024-08-11',
        'General examination'
    ),
    (
        2,
        2,
        '2024-08-12',
        'Health consulation'
    ),
    (
        3,
        3,
        '2024-08-14',
        'General examination'
    ),
    (
        4,
        4,
        '2024-08-18',
        'Emergency care'
    );

INSERT INTO Staff_Job_History (
        staff_id,
        job_type,
        salary,
        department_id,
        created_at
    )
VALUES (
        1,
        'Cardiologist',
        40000000.00,
        1,
        '2019-01-06'
    ),
    (
        2,
        'Neurologist',
        35000000.00,
        2,
        '2020-05-07'
    ),
    (
        3,
        'Head nurse',
        20000000.00,
        3,
        '2021-05-05'
    ),
    (
        4,
        'Associate Administration',
        30000000.00,
        4,
        '2021-05-05'
    );