<a name="readme-top"></a>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a>
    <img src="https://github.com/uoa-compsci399-s2-2023/capstone-project-team-38/blob/main/MarkWiseLogo.png" alt="Logo" width="300" height="100">
  </a>

  <h3 align="center">MarkWise</h3>

  <p align="center">
    Marking Made Easy!
    <br />
    <a href="http://ec2-13-210-24-70.ap-southeast-2.compute.amazonaws.com:3000/"><strong>Start Marking Now »</strong></a>
    <br />
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-markwise">About MarkWise</a>
      <ul>
        <li><a href="#project-management">Project Management</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#future-plan">Future Plan</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About MarkWise

MarkWise is a all inclusive grading solution from rubric to results. Built to satisfy the requirements of an efficient tool for marking, it allows markers to simply upload a rubric, upload a class list and swifty complete marking for as many or as little students as they wish to do so. The output from MarkWise can be used to populate canvas marks without a tedious stage of intermediary files.

Some reasons why this is the most efficient tool:
* To assign grades, markers only need to click one grade option however, bespoke marks are also deliverable
* MarkWise banks pre-specified feedback for common errors, bespoke feedback is also deliverable
* Markers can allocate multiple points of pre-specified feedback per question
* When a class is done, markers can simply export a .json which they can use to feed directly into canvas

<a href="http://ec2-13-210-24-70.ap-southeast-2.compute.amazonaws.com:3000"><strong>Comprehensive MarkWise report coming soon!</strong></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Project Management

We followed a hybrid-agile project management methodology, where we didn't hold all of the possible agile ceremonies but had 1 or 2 week sprints and a standup preceding each sprint. 

Check out our Gantt Chart <a href="https://docs.google.com/spreadsheets/d/1FXC-XolWA-lEN-dtBxOn6xB3BzUao6UFKWu7Q5bzFzc/edit?usp=sharing"><strong>here</strong></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

The core technologies used to build MarkWise:

| Technology  | Use | Version |
| ------------- | ------------- | ------------- |
| HTML  | Front End | 5 |
| CSS  | Front End | 3 |
| React.js | Front End | 18.2.0 |
| Node JS | Back End | 21.0.0 |
| MongoDB (Atlas Clusters) | Database | 6.0 |
| AWS EC2 | Deployment | 4.9.5554 |


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

To run MarkWise you must install Node JS <a href="https://nodejs.org/en/download/current"><strong>here</strong></a> 

### Installation

_Follow the instructions below to run MarkWise on your local machine_

1. Download the repository 
2. Install back end dependencies _(using command line)_
   ```sh
   cd backend
   npm install
   ```
3. Initialise back end
   ```sh
   cd bin
   node www
   ```
4. Install front end dependencies 
   ```sh
   cd frontend
   npm install
   ```
5. Run the application 
   ```sh
   npm start
   ```
6. Exit out of the MarkWise to terminate the application.
   
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE -->
## Usage

Click the link below to go directly to the MarkWise website or watch the demo for an elaborate demo:

1. <a href="http://ec2-13-210-24-70.ap-southeast-2.compute.amazonaws.com:3000"><strong>Go to MarkWise</strong></a>
2. <a href="https://drive.google.com/file/d/1ooT8GMO7-jR0_49NTV8LE-vc6A_EW8pT/view"><strong>Watch a MarkWise Demo »</strong></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- Future Plan -->
## Future Plan

Below is a list of features we'd look to implement for future releases but were either out of scope for our first release or required sigificant time investment: 

- [ ] Edit multiple student grades or feedback simultaneously - for even more optimised efficiency
- [ ] Dark mode option - for enhanced usability
- [ ] Rubric building from scratch
- [ ] Authentication and SSO integration - to allow course coordinators to remidate marking issues quickly
- [ ] Add .pdf file viewer within MarkWise
- [ ] Expand supported rubric and class list import and export file types
    - [x] .json
    - [x] .csv
    - [ ] .xlsx


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

| Name  | Role | Contact |
| ------------- | ------------- | ------------- |
| Donovan Rea  | Project Manager & UI/UX design | drea465@aucklanduni.ac.nz |
| Annie Li  | Lead Backend Developer | sli471@aucklanduni.ac.nz |
| Lily Cai  | Lead Frontend Developer | lcai834@aucklanduni.ac.nz |
| Yuankun (Kelvin) Wang  | Backend Developer | wany973@aucklanduni.ac.nz |
| David Hong Lek Chen  | Full Stack Developer  | dche176@aucklanduni.ac.nz |
| Phu (Dominic) Nguyen  | Full Stack Developer & Deployment Specialist  | pugn783@aucklanduni.ac.nz |


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Key resources used to troubleshoot and learn the intricacies of technologies used in MarkWise:

* <a href="https://nodejs.org/en/docs"><strong>Node JS Documentation</strong></a>
* <a href="https://github.com/reactjs/react.dev"><strong>React.js Documentation</strong></a>
* <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"><strong>Markdown Cheatsheet</strong></a>
* <a href="https://medium.com/@rajani103/deploying-nodejs-app-on-aws-ec2-instance-step-by-step-1b00f807cdce"><strong>AWS EC2 Tutorial</strong></a>

Special thanks to the CS399 course team and the NZ AWS team!

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Node.js]: https://nodejs.org/static/images/logo.svg
[Node-url]: https://nodejs.org/en
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Dynamo.db]: https://docs.aws.amazon.com/assets/r/images/aws_logo_dark.png
[Dynamo-url]: https://aws.amazon.com/dynamodb/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
