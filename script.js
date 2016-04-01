/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */

var student_array = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */

var $name_input;
var $course_input;
var $grade_input;

$(document).ready(function () {

    /**
     * addClicked - Event Handler when user clicks the add button
     */

    $('#add_btn').click(function () {

        addStudent();
        calculateAverage();
        //highlight_High_Low();
    });

    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */

    $('#cancel_btn').click(function () {
        clearAddStudentForm();
        //cancelClicked();
    });
});

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */

function addStudent(student_data) {

    var student = {};
    if (student_data === undefined) {
        $('.noData').remove();
        $name_input = $('#studentName').val();
        $course_input = $('#course').val();
        $grade_input = $('#studentGrade').val();
        student.name = $name_input;
        student.cap_name = student.name.toUpperCase();
        student.course = $course_input;
        student.grade = $grade_input;
    }
    else {
        $('.noData').remove();
        student = {
            course: student_data.course,
            grade: student_data.grade,
            id: student_data.id,
            name: student_data.name,
            cap_name: student_data.name.toUpperCase()
        }
    }
    if (student.name !== "" && student.course !== "" && student.grade !== "") {
        student_array.push(student);
    }

    //addStudentToDom(student);
    updateStudentList();
    clearAddStudentForm();
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */

function clearAddStudentForm() {
    var studentForm = $('.student-add-form');
    $(studentForm).find('#studentName').val('');
    $(studentForm).find('#studentGrade').val('');
    $(studentForm).find('#course').val('');
}

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    var grades_accumulator = null;
    for (var i = 0; i < student_array.length; i++) {
        grades_accumulator += parseInt(student_array[i].grade);
        console.log(grades_accumulator);
    }
    var average = Math.round(grades_accumulator / student_array.length);
    console.log(average);

    average_display = $('span.avgGrade');
    average_display.html(average);

}


/**
 * updateData - centralized function to update the average and call student list update
 */

function updateData() {
    updateStudentList();
    //calulateAverage();
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */

function updateStudentList() {
    if (student_array.length == 0) {
        var user_unavail_msg = $('<td>').attr("colspan", 6).append($('<h2>').html("User Info Unavailable"));
        $('.student-list tbody').html(user_unavail_msg);
    }

    $('tbody > tr').remove();
    for (var i = 0; i < student_array.length; i++) {
        addStudentToDom(student_array[i]);
    }
}

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * //@param studentObj
 */

function addStudentToDom(student) {
    var new_tr = $('<tr>').addClass('table');
    var td_student_name = $('<td>').html(student.name);
    var td_course = $('<td>').html(student.course);
    var td_grade = $('<td>').html(student.grade);
    var td_delete = $('<td>');

    var delete_btn = $('<button>').addClass('btn btn-xs btn-danger').text('Delete');
    //console.log(delete_btn, delete_btn[0]);

    //Delete Function to remove the row and object in array
    delete_btn.click(function () {
        new_tr.addClass('highlighted');
        var choice = confirm('do you want to delete user ' + student.name);
        if (choice) {
            student_array.splice(student_array.indexOf(student), 1);
            new_tr.remove();
        }
        else {
            new_tr.removeClass('highlighted');
        }
        calculateAverage();
        console.log('we were clicked', choice);
    });
    new_tr.append(td_student_name, td_course, td_grade, td_delete);
    td_delete.append(delete_btn);
    $('.student-list > tbody').append(new_tr);

}

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */

function reset() {
    //student_array = [];
    $name_input;
    $course_input;
    $grade_input;

    var unavailable = $('<td>').addClass('noData').attr('colSpan', '4').html('<h4>User Info Unavailable</h4>');
    $('.student-list > tbody').append(unavailable);
}

/**
 * Listen for the document to load and reset the data to the initial state
 */

//Highlight function for highest and lowest grade value
//function highlight_High_Low(){
//    var lowest = 100;
//    var highest = 0;
//    var temp;
//    for(var i = student_array.length-1; i >= 0; i--){
//        temp = student_array[i].grade;
//        if(temp < lowest) {
//            lowest = temp;
//            //$('tbody > tr:nth-child(' + i + ') ').addClass('bg-danger');
//            $('table.table > tbody > tr.table:nth-child(' + i + ') > td ').addClass('bg-danger');
//        }
//        if (temp > highest) {
//            highest = temp;
//        }
//    }
//    console.log('Highest: ',highest);
//    console.log('Lowest: ',lowest);
//}

function make_student_object(data_object) {

}

$(document).ready(function () {

    $('#data_btn').on('click', function () {
        console.log('Data Button Clicked');

        $.ajax({
            dataType: 'json',
            method: 'post',
            data: {
                api_key: 'ITvoGBlH21'
            },
            url: 'http://s-apis.learningfuze.com/sgt/get',

            success: function (response) {
                console.log(response);
                student_array = [];
                for (var i = 0; i < response.data.length; i++) {
                    addStudent(response.data[i])
                }
                updateStudentList();
                calculateAverage();
            }
        });

    });
    reset();
});