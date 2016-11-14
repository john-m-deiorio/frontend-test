# Technicolor App Front End Test created by John M. DeIorio

## Notes/Questions Addressed:

- same button is used to login/logout
- user must be logged in to browse data or sign and view guestbook
- loads 10 states initially, then uses infinite scroll to load more states as needed 10 at a time to max 50
- sort states by name or population
- clicking on a slate will display modal with all state details

1. URL: http://localhost:8888/technicolorApp
2. Libraries Used: Angularjs, jquery, bootstrap, bootswatch, ngInfiniteScroll
3. UI influence: I first sketched out a UI based on requirements.
4. User-Friendly: I use as few instructions as possible, my UI is intuitive because it is simple, clickable areas use pointer cursor, Login redirects user to guest book as a logical first step and acknowledges they are signed in with a personalized welcome message. I made it responsive using bootstrap so it will be accessible on any device.
5. Security: I did not allow users to browse states or see guestbook without being signed in. 
6. Other Security and MISC TBD if I had more time: I would hide all console logging to make it more secure. I would add the objects to the cookie or sessionstorage to allow for persistance upon page refresh but since that wasn't a requirement I didn't add this feature. I would add more form validation. Backend security should have more form validation. I would cleanup code more and add more comments.

I would appreciate your feedback and questions, thanks.