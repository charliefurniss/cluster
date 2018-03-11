# cluster-test

Enabling users to search and filter data stored on the http://c7webtest.azurewebsites.net API.

Users can search via a dropdown menu for data based on grouped data-types or by entering a word by which to search in the textfield. The results are displayed in a list below. They can then filter the results by maximum file size. Because I have not paginated the results I have limited the results to 

I realise that I have only partially met the task criteria. I would still like to:

* Paginate the results
* Show only the path name of each result to users initially
* Show the full details when the user clicks on the path name
* Add a filter for last used date

To improve the readability, I would like to:

* Cache the results of previous searches
* Structure the code better by extracting into helpers, formaters etc


## Build Setup

### install node.js
https://nodejs.org/en/download/package-manager/

### install dependencies
npm install

###
npm run dev

### navigate to
http://localhost:8080