# AUPET

### Description

Webapp that puts in contact a pet owner with a petkeeper

### User Stories

**404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

**500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

**Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup

**Sign up **- As a user I want to sign up on the webpage so that I can see all the events that I could attend

**Login** - As a user I want to be able to log in on the webpage so that I can get back to my account

**Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account

**Events list** - As a user I want to see all the events available so that I can choose which ones I want to attend

**Events create** - As a user I want to create an event so that I can invite others to attend

**Events detail** - As a user I want to see the event details and attendee list of one event so that I can decide if I want to attend
Attend event - As a user I want to be able to attend to event so that the organizers can count me in

### Backlog

List of other features outside of the MVPs scope

User profile: - see my profile - upload my profile picture - see other users profile -

list of events created by the user - list events the user is attending

Geo Location: - add geolocation to events when creating - show event in a map in event

detail page - show all events in a map in the event list page

Homepage: - …

### ROUTES

Untitled

### Models

**_User Model_**

```javascript
{
    name: {  type: String, required: true, unique: true },
    lastName: String,
    username: { type: String, required : true, unique : true},
    password: { type: String, required: true},
    telephone: [],
    email: { type: String },
    address: {
       street: {type: String },
       number: Number,
       zipcode: Number,
       city: String
   },
   img = {type: String, required: true}},

{
  timestamps: true
}

```

**_Event Model_**

```javascript
{
    name: { type: String, required: true, unique: true },
    lastName: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telephone: [Number],
    email: { type: String },
    address: {
        street: { type: String },
        number: Number,
        zipcode: Number,
        city: String
    },
    img: { type: String, required: true }
},
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
    owner: Schema.Types.ObjectId /*ObjectId<User>*/,
    event: Schema.Types.ObjectId /*ObjectId<Event>*/,
    rating: Number /* “⭐”*/,
    comment: { type: String },
    executer: Schema.Types.ObjectId /*ObjectId<User>*/
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
