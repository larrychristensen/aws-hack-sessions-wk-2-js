#!/usr/bin/env node

'use strict';

const readline = require('readline');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// TODO: REPLACE my-name WITH YOUR NAME IN BUCKET_PREFIX, e.g. ostk-hack-sessions-larry-christensen-week-1
const BUCKET_PREFIX = "ostk-hack-sessions-my-name-week-1-";

function println(arg) {
    console.log(arg + "\n");
}

function doesBucketExist(bucketName) {
    console.log("CHECKING IF BUCKET ${bucketName} EXISTS");
    // TODO: Implement Me!
    return false;
}

function createS3BucketIfItDoesNotExist(bucketName) {
    // TODO: (EXTRA CREDIT) enable versioning on the bucket
    // TODO: (EXTRA CREDIT) tag the bucket with 'Creator'=<your name>, Project='Hack Sessions Week 2'
    // TODO: (EXTRA CREDIT) enable cross-region replication on the bucket
    if (!doesBucketExist(bucketName)) {
        console.log("BUCKET ${bucketName} DID NOT EXIST, CREATING IT");
        // TODO: Implement Me!
    }
}

function bucketNameForGroup(groupName) {
    // Amazon S3 defines a bucket name as a series of one or more labels, separated by periods, that adhere to the following rules:
    // * The bucket name can be between 3 and 63 characters long, and can contain only lower-case characters, numbers, periods, and dashes.
    // * Each label in the bucket name must start with a lowercase letter or number.
    // * The bucket name cannot contain underscores, end with a dash, have consecutive periods, or use dashes adjacent to periods.
    // * The bucket name cannot be formatted as an IP address (198.51.100.24).
    // TODO: (EXTRA CREDIT) perform a more sophisticated conversion
    const validGroupName = groupName
        .toLowerCase()
        .replace("/[^a-z0-9\\-]/g", "-");
    console.log("CONVERTING INPUT GROUP NAME ${groupName} TO VALID GROUP NAME ${validGroupName}");
    return BUCKET_PREFIX + validGroupName;
}

function promptForGroupName(answerFn) {
    return promptForStringInput("Enter the name of the password group:", answerFn);
}

function getBucketName(bucketFn) {
    promptForGroupName(groupName => {
        const bucketName = bucketNameForGroup(groupName);
        console.log("CONVERTING INPUT GROUP NAME ${groupName} TO VALID BUCKET NAME ${bucketName}");

        bucketFn(bucketName);
    });
}

function objectKeyForLogin(loginName) {
    // TODO: (EXTRA CREDIT) S3 will accept any UTF-8 characters for an object key, but certain characters can cause
    // issues with some applications, so we should add more sophisticated validation and/or transformation.
    // See https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html for more info.
    return loginName;
}

function getBucketNameAndObjectKey(bucketAndKeyFn) {
    getBucketName(bucketName => {
        const loginName = promptForLoginName();

        const objectKey = objectKeyForLogin(loginName);

        bucketAndKeyFn(bucketName, objectKey);
    });
}

function promptForStringInput(s, answerFn) {
    rl.question(s, answerFn);
}

function promptForLoginName(answerFn) {
    return promptForStringInput("Enter the login name:", answerFn);
}

function createLoginText(username, password) {
    return "Username: " + username + "\nPassword: " + password;
}

function saveLogin() {
    getBucketNameAndObjectKey((bucketName, objectKey) => {
        promptForStringInput("Enter the username or email:", username => {
            promptForStringInput("Enter the password:", password => {
                const loginText = createLoginText(username, password);

                createS3BucketIfItDoesNotExist(bucketName);

                console.log(
                    "PUTTING OBJECT WITH KEY #{objectKey} TO BUCKET ${bucketName} WITH CONTENT: \n${loginText}");

                // TODO: Implement Me!
            });
        });
    });
}

function listLoginGroups() {
    println("LISTING LOGIN GROUPS BY LISTING BUCKETS WITH BUCKET_PREFIX, REMOVING THE PREFIX FROM EACH, AND " +
        "PRINTING THE RESULTING VALUES");
    // TODO: Implement Me!
}

function listLogins() {
    getBucketName(bucketName => {
        println("LISTING OBJECTS WITHIN THE BUCKET " + bucketName);
        // TODO: Implement Me!
    });
}

function lookupLogin() {
    getBucketNameAndObjectKey((bucketName, objectKey) => {
        console.log(
            "GETTING OBJECT CONTENTS FOR OBJECT WITH KEY ${objectKey} FROM BUCKET ${bucketName}");

        // TODO: Implement Me!
    });
}

function deleteLogin() {
    getBucketNameAndObjectKey((bucketName, objectKey) => {
        console.log(
            "DELETING OBJECT WITH KEY ${objectKey} FROM BUCKET ${bucketName}");

        // TODO: (extra credit) If you enabled versioning, delete all versions
        // TODO: (extra credit) If you enabled cross-region replication, delete the bucket it is replicating to

        // TODO: Implement Me!
    });
}

function deleteGroup() {
    getBucketName(bucketName => {
        console.log(
            "GETTING THE LIST OF ALL OBJECTS FROM BUCKET ${bucketName} TO DELETE THEM");

        // TODO: Implement Me!

        println(String.format(
            "DELETING BUCKET %s",
            bucketName));
        // TODO: Implement Me!
    });
}

function handleOperationAnswer(selection) {
    switch (selection) {
        case "1":
            saveLogin();
            break;
        case "2":
            listLoginGroups();
            break;
        case "3":
            listLogins();
            break;
        case "4":
            lookupLogin();
            break;
        case "5":
            deleteLogin();
            break;
        case "6":
            deleteGroup();
            break;
        default:
            println("SOPHISTICATED HACK ATTEMPT DETECTED AND BLOCKED, GOODBYE.");
            break;
    }
}

rl.question("What do you want to do? Enter a number for one of the options below:\n" +
    "1. Save a login.\n" +
    "2. List login groups.\n" +
    "3. List logins in a group.\n" +
    "4. Lookup login.\n" +
    "5. Delete a login from a group.\n" +
    "6. Delete a login group.\n",
    handleOperationAnswer);