"use strict"
const fetchLink = "http://petlatkea.dk/2019/hogwartsdata/students.json";
const sortBtn = document.querySelectorAll(".inputSort");
const filterBtn = document.querySelectorAll(".inputFilter");
let expelBtn = document.querySelectorAll(".expelBtn");

let i, house_1, house_2, house_3, house_4, expelled, attending;
i = 0;
let executed = false;
let actualFilter;

let studentArray = [];
let fullArray = [];

JSONFetch();

function JSONFetch() {
    fetch(fetchLink).then(result => result.json()).then(data => createArray(data));
};

function createArray(data) {
    data.forEach(data => {
        let student = {
            firstName: "",
            lastName: "",
            middleName: "",
            nickName: "",
            house: "",
            fullName: "",
            prefect: false,
            blood: false,
            squad: false,
            expelled: false,
            photo: true,
            sameFirstLetter: false,
            id: "",
        }

        student.house;
        student.fullName = data.fullname.trim();
        student.house = data.house.trim();
        studentArray.push(student);
        separateNames(student);
        Casing(student);
        addID(student);

    })
    studentArray[3].photo = studentArray[9].photo = false;
    studentArray[14].sameFirstLetter = studentArray[19].sameFirstLetter = true;
    fullArray = studentArray;
    countStudents(fullArray);
    createStudentList(studentArray);
    addFilterListeners(studentArray);
}

function addID(student) {
    student.id = i;
    i++;
}

function addFilterListeners(studentArray) {
    filterBtn.forEach(e => {
        e.addEventListener("click", e => {
            filterElements(e, studentArray)
        })
    });
}

//SEPARATE
function separateNames(student) {
    let i, spaces = 0;
    let lastSpace = student.fullName.lastIndexOf(" ");
    let space = student.fullName.indexOf(" ");

    //Check if the name has more than first name
    if (student.fullName.includes(" ")) {
        student.firstName = student.fullName.substring(0, space);
        student.lastName = student.fullName.substring(lastSpace + 1);
    } else {
        student.firstName = student.fullName;
    }

    //Spaces counter
    for (i = 0; i < student.fullName.length; i++) {
        if (student.fullName[i] == " ") {
            spaces++;
        }
    }

    //Check Nickname or Middle name
    switch (spaces) {
        case 2:
            if (student.fullName[space + 1] == "\"") {
                student.nickName = student.fullName.substring(space + 2, lastSpace - 1);
            } else {
                student.middleName = student.fullName.substring(space + 1, lastSpace);
            }
    }


}

function createStudentList(studentArray) {
    console.log(studentArray);
    document.querySelector('.students_fill').textContent = "";
    for (i = 0; i < studentArray.length; i++) {
        let clone = document.querySelector(".template_students").content.cloneNode(true);
        if (studentArray[i].photo == false) {
            clone.querySelector(".student_photo").src = "img/no-photo.png";
        }
        if (studentArray[i].sameFirstLetter == true) {
            clone.querySelector(".student_photo").src = "img/students/" + studentArray[i].lastName.toLowerCase() + "_" + studentArray[i].firstName.toLowerCase() + ".png";
        }
        if ((studentArray[i].photo == true) && (studentArray[i].sameFirstLetter == false)) {
            clone.querySelector(".student_photo").src = "img/students/" + studentArray[i].lastName.toLowerCase() + "_" + studentArray[i].firstName.substring(0, 1).toLowerCase() + ".png";
        }
        clone.querySelector(".firstName").textContent = studentArray[i].firstName;
        clone.querySelector(".lastName").textContent = studentArray[i].lastName;
        clone.querySelector(".student_house").textContent = studentArray[i].house;
        clone.querySelector(".student").id = studentArray[i].id;
        document.querySelector('.students_fill').appendChild(clone);
    }

    //
    addStudentListener();

    function addStudentListener() {
        document.querySelectorAll(".student").forEach(li => {
            li.addEventListener("click", e => {
                fillProfile(e, fullArray);
            })
        })
    }
}




/* function sortArrays(studentArray) {

    document.querySelectorAll(".inputSort").forEach(function (e) {
        if (e.checked) {
            if (e.classList.contains("sortByFirstName")) {
                studentArray = studentArray.sort(function (a, b) {
                    return a.firstName.localeCompare(b.firstName);
                });
            }
            if (e.classList.contains("sortByLastName")) {
                studentArray = studentArray.sort(function (a, b) {
                    return a.lastName.localeCompare(b.lastName);
                });
            }
            if (e.classList.contains("sortByHouse")) {
                studentArray = studentArray.sort(function (a, b) {
                    return a[house].localeCompare(b[house]);
                });
            }

        }
    })
} */

function sortArrays(e, studentArray) {
    let sortBy;
    switch (e.target.id) {
        case "firstName":
            sortBy = "firstName";
            break;
        case "lastName":
            sortBy = "lastName";
            break;
        case "house":
            sortBy = "house";
            break;
    }
    studentArray = studentArray.sort((a, b) => {
        return a[sortBy].localeCompare(b[sortBy]);
    })

    createStudentList(studentArray);
}

function filterElements(e, studentArray) {
    let selected;
    if (e == null) {
        selected = "All";
        console.log(e);
    } else {
        selected = e.target.id;
    }

    studentArray = studentArray.filter(filterByHouse);

    function filterByHouse(student) {
        if (selected === "All") {
            return true;
        }
        if ((selected === "Expelled") && (student.expelled == true)) {
            return true;
        }
        if ((selected === "Attending") && (student.expelled == false)) {
            return true;
        }
        if (student.house === selected) {
            return true;
        } else return false;
    }
    createStudentList(studentArray);
    addSortListeners(studentArray);
    actualFilter = e;
    console.log(actualFilter);

}

function addSortListeners(studentArray) {
    sortBtn.forEach(e => {
        e.addEventListener("click", e => {
            sortArrays(e, studentArray)
        })
    });
}

function Casing(student) {
    for (let objects in student) {
        if (!((student[objects] == false) || (student[objects] == true))) {
            student[objects] = student[objects].toLowerCase();
            student[objects] = student[objects].substring(0, 1).toUpperCase() + student[objects].slice(1);
        }
    }

}

function countStudents(studentArray) {
    house_1 = house_2 = house_3 = house_4 = expelled = attending = 0;
    for (i = 0; i < studentArray.length; i++) {
        switch (studentArray[i].house) {
            case "Hufflepuff":
                house_1++;
                break;
            case "Gryffindor":
                house_2++;
                break;
            case "Ravenclaw":
                house_3++;
                break;
            case "Slytherin":
                house_4++;
                break;
        }
        if (studentArray[i].expelled == true) {
            expelled++;
        } else {
            attending++;
        }
    }

    document.querySelector(".list_number_all").textContent = studentArray.length;
    document.querySelector(".list_number_attending").textContent = attending;
    document.querySelector(".list_number_house_1").textContent = house_1;
    document.querySelector(".list_number_house_2").textContent = house_2;
    document.querySelector(".list_number_house_3").textContent = house_3;
    document.querySelector(".list_number_house_4").textContent = house_4;
    document.querySelector(".list_number_expelled").textContent = expelled;

}


function fillProfile(e, studentArray) {
    console.log(e.target.parentElement.id);
    let id = e.target.parentElement.id;

    console.log(studentArray[id].firstName);
    const placeholder = document.querySelector(".placeholder_student_profile");
    placeholder.innerHTML = "";
    let clone = document.querySelector(".template_student_profile").content.cloneNode(true);
    clone.querySelector(".student_profile_firstName").innerHTML = "<span>First name: </span>" + studentArray[id].firstName;
    if (studentArray[id].middleName !== "") {
        clone.querySelector(".student_profile_middleName").innerHTML = "<span>Middle name: </span>" + studentArray[id].middleName;
    }
    if (studentArray[id].nickName !== "") {
        clone.querySelector(".student_profile_nickName").innerHTML = "<span>Nick name: </span>" + studentArray[id].nickName;
    }
    if (studentArray[id].lastName !== "") {
        clone.querySelector(".student_profile_lastName").innerHTML = "<span>Last name: </span>" + studentArray[id].lastName;
    }
    if (studentArray[id].photo == false) {
        clone.querySelector(".student_profile_photo").src = "img/no-photo.png";
    }
    if (studentArray[id].sameFirstLetter == true) {
        clone.querySelector(".student_profile_photo").src = "img/students/" + studentArray[id].lastName.toLowerCase() + "_" + studentArray[id].firstName.toLowerCase() + ".png";
    }
    if ((studentArray[id].photo == true) && (studentArray[id].sameFirstLetter == false)) {
        clone.querySelector(".student_profile_photo").src = "img/students/" + studentArray[id].lastName.toLowerCase() + "_" + studentArray[id].firstName.substring(0, 1).toLowerCase() + ".png";
    }
    clone.querySelector(".student_profile_crest").src = "img/housecrests/" + studentArray[id].house.toLowerCase() + ".png";
    clone.querySelector(".expelBtn").innerHTML = "Expel";
    clone.querySelector(".expelBtn").id = studentArray[id].id;
    placeholder.appendChild(clone);

    expelBtn = document.querySelectorAll(".expelBtn");
    addExpelListener(studentArray);
}


function addExpelListener(studentArray) {
    expelBtn.forEach(e => {
        e.addEventListener("click", e => {
            expelStudent(e.target.id, studentArray)
        })
    });
}

function expelStudent(id, studentArray) {
    studentArray[id].expelled = true;
    fullArray[id].expelled = true;
    console.log(studentArray[id]);
    console.log(actualFilter);
    countStudents(fullArray);
    filterElements(actualFilter, studentArray);
}