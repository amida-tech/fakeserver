module.exports = {
    name: 'fake server',
    address: 'localhost',
    port: 3000,
    description: 'This is the description of the fake server... it gets sent when requesting the root ("/")',
    routesget: [
        {
            path: '/test',
            response: 'this is the test response'
        },
        {
            path: '/another',
            response: 'blah blah blah'
        }
    ],
    routespost: []
};

//"Basic " + Base64.encode(username + ":" + password);

//POST
//var d = new Date();
//www.myhealth.va.gov/mhv-portal-web/mhv.portal?_nfpb=true&_windowLabel=downloadData&downloadData_actionOverride=%2Fgov%2Fva%2Fmed%2Fmhv%2Fusermgmt%2FdownloadYourData%2FdownloadSelectionsReport&_pageLabel=downloadData&downloadDatawlw-radio_button_group_key%3A%7BactionForm.pickDate%7D=downloadSelectedDateRanges&downloadDatawlw-select_key%3A%7BactionForm.fromDateMonth%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.fromDateMonth%7D=1&downloadDatawlw-select_key%3A%7BactionForm.fromDateDay%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.fromDateDay%7D=1&downloadDatawlw-select_key%3A%7BactionForm.fromDateYear%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.fromDateYear%7D=1895&downloadDatawlw-select_key%3A%7BactionForm.toDateMonth%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.toDateMonth%7D=" + (d.getMonth() + 1) + "&downloadDatawlw-select_key%3A%7BactionForm.toDateDay%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.toDateDay%7D=" + d.getDate() + "&downloadDatawlw-select_key%3A%7BactionForm.toDateYear%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.toDateYear%7D=" + d.getFullYear() + "&downloadDatawlw-radio_button_group_key%3A%7BactionForm.pickDataClasses%7D=downloadAllDataClasses&downloadDatawlw-checkbox_key%3A%7BactionForm.futureappointments%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.pastappointments%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.appointmentsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.appointmentsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.prescriptions%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.medications%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.medsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.medsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vachemlabs%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vapathology%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.varadiology%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vaekg%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.labsandtests%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.labsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.labsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vaproblemlist%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vaadmissionsanddischarges%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vaprogressnotes%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.wellness%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.wellnesshistoryall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.wellnesshistoryall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vaallergies%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.seiallergies%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.allergiesall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.allergiesall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vaimmunizations%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.immunizations%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.immunizationsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.immunizationsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vavitals%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vitalsandreadings%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vitalsandreadingsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vitalsandreadingsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.medicalevents%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.familyhealthhistory%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.militaryhealthhistory%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.treatmentfacilities%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.healthcareproviders%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.healthhistoryall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.healthhistoryall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.activityjournal%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.foodjournal%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.foodactivityall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.foodactivityall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.currentgoals%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.completedgoals%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.goalsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.goalsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vademographics%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.seidemographics%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.healthinsurance%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.demohealthall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.demohealthall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.dodmilitaryservice%7DOldValue=false
//response: <a href="javascript:setValue(54531063439,'pdfFormat')" class="mhv-input-button" style="text-decoration: none; display: inline-block; padding-left: 0px; padding-right: 0px; width: 187px; margin: 0px;" onclick="mhv_wt_track(9);">Download PDF File</a>

//POST (basic files)
//www.myhealth.va.gov/mhv-portal-web/downloadData?reportId=" + recordId + "&downloadFormat=textFormat //pdfFormat
//response: file


//POST (check for daily)
//www.myhealth.va.gov/mhv-portal-web/mhv.portal?_nfpb=true&_windowLabel=downloadData&downloadData_actionOverride=%2Fgov%2Fva%2Fmed%2Fmhv%2Fusermgmt%2FdownloadYourData%2FdownloadReport&_pageLabel=downloadData&operation=downloadHealthHistoryData
//response: Your information update is complete.  <a href="https://www.myhealth.va.gov:443/mhv-portal-web/mhv.portal?_nfpb=true&_pageLabel=downloadData&downloadData_actionOverride=/gov/va/med/mhv/usermgmt/downloadYourData/viewCCDReport&requestDate=2015-07-15T14%3A02%3A21.000-0400" class="mhv-input-button" style="text-decoration: none">View/Print</a></div>


//POST (Download advanced)
//https://myhealth.va.gov/mhv-portal-web/downloadCCDData?patientId=&requestDate=2015-07-15T14%3A02%3A21.000-0400&downloadFormat=xml
//response: file