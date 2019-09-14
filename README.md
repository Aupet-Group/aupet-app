# AUPET

### Description

Webapp that puts in contact a pet owner with a petkeeper

### User Stories / MVP

**404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

**500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

**Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup

**Sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend

**Login** - As a user I want to be able to log in on the webpage so that I can get back to my account

**Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account

**Pet:**
- As a user I want to add the profile of my pet.

**Events:**

- As a user I want to create my events.
- As a user I want to accept a keeper.
- As a user I want to enroll in an event.
- As a user I want to list all existing events.

### Backlog

List of other features outside of the MVPs scope

**User profile:**

- As a user I want to edit my profile.
- As a user I want to delete my profile.
- As a user I want to view my profile.
- As a user I want to view other profiles.

**Pet:**

- As a user I want to edit the profile of my pet.
- As a user I want to delete the profile of my pet.
- As a user I want to list the profiles of my pets.

**Events:**

- As a user I want to edit my events.
- As a user I want to delete my events.
- As a user I want to list my events.
- As a user I want to reject a keeper.
- As a user I want to unsubscribe from am event.
- As a user I want to invite a keeper for my event.
- As a user I want to list of events the user is attending.
- As a user I want to user geolocation:
add geolocation to events when creating - show event in a map in event

**Alerts:**

- As a user I want to subscribe to an alert.
- As a user I want to unsubscribe from an alert.

**Reviews:**
- As a user I want create my review about my event.
- As a user I want create a review of the event in which I was involved.
- As a user I want to edit my review.
- As a user I want to delete my review.
- As a user I want list my reviews.
- As a user I want list user reviews.

**Searches:**
- As a user I want to search user applying filters.
    ( By ranking, by zone, by pet, by type of services,by price, by geolocation )
- As a user I want to search event applying filters.
    ( By date, by zone, by pet, by type of services, by geolocation )

**Chat:**
- As a user I want to chat with other user.

### ROUTES

| Mockup | Name | Method | Endpoint | Description | Body | Redirects |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Home | GET | / | Show home page | - |  |
| 2 | Sign Up Form | GET | /signup | User see the form in order to sign up | - |   | 
| 2 | Sign Up | POST | /signup | Sign up a user | {email, password} | /profile | 
| 3 | Log In Form | GET | /login | User see the form in order to log in | - |  | 
| 3 | Log In | POST | /login | Log in a user | {email, password} | /profile | 
|  | Log Out | POST | /logout | Log out a user | - |  | 
| 4 | Profile | GET | /profile | User see his/her profile | - |  | 
| 5 | Add Pet | GET | /pets/new | User see the form in order to add a pet | - |  | 
| 5 | Add Pet | POST | /pets | Add a pet | {petType, petWeight, petName, petAge} | /profile |
| 6 | Add Event | GET | /events/new | User see the form in order to add en event | - |  | 
| 6 | Add Event | POST | /events | Add en event | {title, description, initialDateTime, finalDateTime, location} | /profile |
| 7 | List All Events | GET | /events | Show all events | - |  |
| 8 | Event View | GET | /events/:eventID | Show an event infromation | - |  |  
| 9 | My Events | GET | /profile/events | Show a user events | - |  | 

### Models

**_User Model_**

```javascript
{
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  name: { type: String },
  lastName: { type: String },
  username: { type: String },
  phone: Number,
  mobile: Number,
  secondaryPhone: Number,
  address: [{
    street: { type: String },
    number: Number,
    zipcode: Number,
    city: { type: String },
  }],
  img: { type: String },
},

{
  timestamps: true
}

```

**_Event Model_**

```javascript
{ 
	owner: Schema.Types.ObjectId, /*ObjectId<User>*/
	title: String,
	description: String
	creationEventDate: Date.now(),
            initialDateTime: Date
            finalDateTime: Date
	location: User Adress,
    keeper: Schema.Types.ObjectId /*[ObjectId<User>*/
    pet: [{ type: Schema.Types.ObjectId, ref: Pet }]
}
,
{
    timestamps: true
}
```

**_Pet Model_**

```javascript
{
    owner: Schema.Types.ObjectId, /* ObjectId<User>  */
    petType: String,
    petWeight: Number,
    petName: String,
    petAge: Number,
    petImg: [String],
    event:  Schema.Types.ObjectId /*ObjectId<Event>},*/
},
{
    timestamps: true
}
```

**_Review Model_**

```
{
    owner: Schema.Types.ObjectId /* ObjectId<User> */,
    event: Schema.Types.ObjectId /* ObjectId<Event> */,
    rating: Number /* “⭐” */,
    comment: { type: String },
    keeper: Schema.Types.ObjectId, /* ObjectId<User> */
},
{
    timestamps: true
}`
```

### Git

[Repository Link](https://github.com/aupet-group/aupet-app)

[Deploy Link](deploy)

### Slides

[Slides Link](slides)
