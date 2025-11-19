# Cloud-Arcade_ICT-171
**Student Name:** Mohammed Affan Parkar
**Student ID:** 35757491
**University NAME:** Murdoch
**Unit:** 171

**Public IP:** 98.70.26.28 

**Domain:** https://cloud-arcade.com/

**Contact Email (for SSL):** affabparkar69@gmail.com

**Video Explainer:** https://drive.google.com/file/d/1GNMn5TEQ3MNljeiI6R-4DlITT-1zsgTp/view?usp=drive_link

**PPT For Video Explainer:** https://docs.google.com/presentation/d/1z62aT2cZxysZVAHxMm8hQbjdOiQm2-kf/edit?usp=drive_link&ouid=109435709903294545890&rtpof=true&sd=true

**Total Cost OF Ownership for Cloud-Arcade:** https://docs.google.com/presentation/d/1hVKjY3ayRpYyBP3DW-6ij04sb0zCksej/edit?usp=drive_link&ouid=109435709903294545890&rtpof=true&sd=true



# About Project
**Cloud-Arcade**
- CloudArcade is a cloud-hosted gaming website featuring browser-based games.

- It enables a lightweight, responsive, and accessible browser-based gaming experience across all modern browsers.

- CloudArcade is hosted on a Microsoft Azure Virtual Machine (Ubuntu) using Infrastructure as a Service (IaaS) and an Apache web server.

- CloudArcade is released under the MIT License (© 2025 Mohammed Affan Parkar), which supports open-source learning, collaboration, and respect for intellectual property.


# Building The Website

- The website Cloud Arcade is created using HTML, CSS, and JS

- The website sites files are kept organized

- The home page contains 5 games which you can play, and all the games were built individually and tested to make sure they run on phone and desktop

- All visual effects (animations, colors, transitions) are created using CSS, whereas JavaScript runs the gameplay logic and makes the website interactive.

**How files are organized for the website**

<img width="514" height="573" alt="image" src="https://github.com/user-attachments/assets/e5966b11-a4ae-445d-9e54-2f0b4b68ba67" />


**Sample of HTML code**

<img width="474" height="573" alt="image" src="https://github.com/user-attachments/assets/e60667fe-c906-463f-9d81-6326740b2f93" />


**Sample of CSS code** 

<img width="474" height="509" alt="image" src="https://github.com/user-attachments/assets/f5ac2f5f-31ce-4009-a7db-fe4d193493ca" />


**Sample of JAVA code** 

<img width="504" height="509" alt="image" src="https://github.com/user-attachments/assets/6073cba4-243f-4a7d-97f9-515c426ad504" />



# Setting up of Virtual Machine<img

- Creating a new Microsoft Azure account

- Creating a Virtual Machine in Microsoft Azure 

- Starting the Azure VM

- Unable to SSH, HTTP, and HTTPS ports

**Setting up Azure VM**

<img width="767" height="355" alt="image" src="https://github.com/user-attachments/assets/9264f482-0072-4851-beb3-8456e184ace0" />


**Main page of Azure** (you can start or stop the VM and find the public IP adress from here)

<img width="767" height="389" alt="image" src="https://github.com/user-attachments/assets/62a0fa65-48af-4554-bcb4-c4b0b49f0a08" />


**Allowing SSH, HTTP, and HTTPS**

<img width="762" height="331" alt="image" src="https://github.com/user-attachments/assets/2cc4628e-2010-4f49-805d-4e0915409915" />


# Connecting VM to Azure

**To connect the VM to Azure, you need to run a few commands. They are**
- **ssh CloudArcade@20.163.58.151** (Connecting to Azure)

 <img width="1170" height="910" alt="Screenshot 2025-11-05 235229" src="https://github.com/user-attachments/assets/c3eaa251-c71b-418f-81a7-06d177af7f35" />



- **sudo apt update** (Updating sudo)

 <img width="1510" height="941" alt="Screenshot 2025-11-06 000648" src="https://github.com/user-attachments/assets/4decdd44-e438-406e-aff7-7dd8fbc2fa17" />




- **sudo apt upgrade** (Upgrading sudo)

 <img width="1453" height="872" alt="Screenshot 2025-11-06 000729" src="https://github.com/user-attachments/assets/7f01c76c-0502-4fad-8fd5-cbedcaab7dbe" />



- **sudo apt install apache2 -y** (Installing apache)

 <img width="1671" height="334" alt="Screenshot 2025-11-06 003714" src="https://github.com/user-attachments/assets/79b0854b-6d88-468c-9b90-1c82aa1f39cb" />



- **Sudo sysetmctl enable apache2** 
-  **Sudo systemctl start apache2** (Enabling and starting apache)

 <img width="1327" height="752" alt="Screenshot 2025-11-06 003930" src="https://github.com/user-attachments/assets/b6e21d80-5f92-41af-a0d7-4bf1df7c6b04" />


- **scp -r "C:\msys64\ucrt64\bin\projects\helloworld\CloudArcade\*" CloudArcade@20.163.58.151:/var/www/html/** (Transfering files to Azure)

 <img width="1910" height="1014" alt="Screenshot 2025-11-17 010713" src="https://github.com/user-attachments/assets/44450be0-38dc-4e7d-8a58-1402f153b529" />



# Connecting domain Cloud-arcade.com

- **Buy the domain name**

 <img width="506" height="386" alt="image" src="https://github.com/user-attachments/assets/aabb9661-e194-41c0-b5b2-ef84862fe591" />


- **Setting up the domain**

  
 <img width="470" height="568" alt="image" src="https://github.com/user-attachments/assets/8eb501a4-d588-4f07-a956-8571f360fd5f" />



 - **Connecting domain name to Azure**

 <img width="506" height="727" alt="image" src="https://github.com/user-attachments/assets/22a0982f-4eaa-4267-8ac8-214a29440ba8" />



# Enabling SSL (HTTPS)

- **Sudo apt install certbot python-3- certbot-apache -y** (Installing certbot for SSL certificate)

 <img width="1782" height="876" alt="Screenshot 2025-11-07 225954" src="https://github.com/user-attachments/assets/5d66db5b-c14e-4ce4-9ee1-01649357f998" />



- **Sudo certbot --apache** (Connected to SSL and getting the certificate)

 <img width="1290" height="546" alt="Screenshot 2025-11-07 230139" src="https://github.com/user-attachments/assets/df69519c-53c1-46a8-b8ba-c6b3edf670c4" />  <img width="892" height="892" alt="Screenshot 2025-11-07 230352" src="https://github.com/user-attachments/assets/7f41c5a5-3f1c-4a62-bad9-71def113ac50" />



 - **Sudo apache3clt -S** (Checking if SSL is set up properly)

   <img width="1715" height="1057" alt="Screenshot 2025-11-17 014001" src="https://github.com/user-attachments/assets/3f441b88-27fa-431b-beb4-e437f70840cb" />



# website

**Home page**

<img width="1894" height="878" alt="image" src="https://github.com/user-attachments/assets/06fd931f-e26f-44bf-95d6-a62962d2e54c" />



**Tic-Tac-Toe Game**

<img width="1917" height="913" alt="image" src="https://github.com/user-attachments/assets/92aa0e5b-f9c1-4bda-b1b0-5b431e66d9e7" />



**Rock Paper Scissors Game**

<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/c5acaee9-0e46-47e0-88d9-0f4c0b77fc95" />


**Guess the Number Game**

<img width="1918" height="904" alt="image" src="https://github.com/user-attachments/assets/2871f88e-3b3b-4a37-a884-50d3036f10f5" />


**Memory Match Game**

<img width="1877" height="876" alt="image" src="https://github.com/user-attachments/assets/5e4efc54-d89f-4f04-8636-a278ae2e798c" />



**Memory Paint Game**

<img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/9180e210-52ec-44d9-86a8-40501bf0a281" />



# SSL Certificate

<img width="681" height="641" alt="image" src="https://github.com/user-attachments/assets/c3dccaa8-15e7-49af-875c-af08ddf1bb2c" />


# Conclusion

- By doing this project, I got to know how to build a website form Strach using HTML, JAVA, and CSS

- We have also learned how to step up VM, host Apache, configure DNS, and set up SSL.

- We have improved our problem-solving and critical thinking skills

# Project Over

