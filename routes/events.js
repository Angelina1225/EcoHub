import { Router } from 'express';
import Event from '../models/Event.js';
import { User } from '../models/User.js';

const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const user = req.session.user;
            const searchTerm = req.query.query || '';
            let events;

            if (searchTerm) {
                events = await Event.find({
                    $and: [
                        { eventDate: { $gte: Date.now() } },
                        {
                            $or: [
                                { title: { $regex: searchTerm, $options: 'i' } },
                            ]
                        }
                    ]

                }).sort({ eventDate: 1 }).lean();
            } else {
                events = await Event.find({
                    eventDate: { $gte: Date.now() }
                }).sort({ eventDate: 1 }).lean();
            }

            events.forEach((event) => {
                event.eventFormattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                });

                event.eventFormattedTime = new Date(event.eventDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                });
            });

            return res.render('./events/allEvents', {
                layout: 'main',
                title: 'Events | EcoHub',
                user: user,
                events: events,
                searchTerm: searchTerm
            });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    });

router.route('/addEvent')
    .get(async (req, res) => {
        try {
            const user = req.session.user;

            if (user) {
                return res.render('./events/addEvent', {
                    layout: 'main',
                    title: 'Add Event | EcoHub',
                    user: user
                });
            }

            return res.redirect('/signin');
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {
        try {
            const { title, description, specialConditions, eventDate, eventTime, place, requiredVolunteer, volunteersNeeded } = req.body;
            const fullDate = new Date(`${eventDate}T${eventTime}`);

            const existingEvent = await Event.findOne({
                title,
                description,
                specialConditions,
                eventDate: fullDate,
                "place.address": place.address,
                "place.city": place.city,
                "place.state": place.state,
                "place.zip": place.zip,
                requiredVolunteer: volunteersNeeded === 'true' ? requiredVolunteer : 0
            });

            if (existingEvent) {
                return res.render('./events/addEvent', {
                    layout: 'main',
                    title: 'Add Event | EcoHub',
                    hasError: true,
                    error: 'An event with the same details already exists. Please modify the details.',
                });
            }

            const newEvent = new Event({
                title,
                description,
                specialConditions,
                eventDate: fullDate,
                place,
                requiredVolunteer: volunteersNeeded === 'true' ? requiredVolunteer : 0,
            });

            await newEvent.save();
            return res.status(201).redirect('/events')
        } catch (err) {
            if (err.name === 'ValidationError') {
                const eMsg = Object.values(err.errors).map((e) => e.message).join(', ');
                return res.render('./events/addEvent', {
                    layout: 'main',
                    title: 'Add Event | EcoHub',
                    hasError: true,
                    error: eMsg,
                });
            }

            if (err.code === 11000) {
                return res.render('./events/addEvent', {
                    layout: 'login',
                    title: 'Add Event | EcoHub',
                    hasError: true,
                    error: 'Username or email already exists',
                });
            }

            return res.status(500).render('./events/addEvent', {
                layout: 'main',
                title: 'EcoHub | Add Event',
                hasError: true,
                error: 'Failed to create event. Please try again later.',
            });
        }
    });

router.route('/eventRegister')
    .get(async (req, res) => {
        try {
            const user = req.session.user;

            if (!user) {
                return res.redirect('/signin')
            }

            const title = req.query.title;
            const event = await Event.findOne({ title: title });

            if (!event) {
                return res.redirect('/events');
            }

            event.eventFormattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
            });

            event.eventFormattedTime = new Date(event.eventDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });

            return res.render('./events/eventRegister', {
                layout: 'main',
                title: `Register to Event - ${title} | EcoHub `,
                event: event,
                user: user,
                specialConditions: {
                    isSpecialConditions: event.specialConditions ? true : false,
                    specialConditions: event.specialConditions
                },
                availableVolunteers: event.availableVolunteers > 0 ? true : false
            });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {
        try {
            const user = req.session.user;

            if (!user) {
                return res.redirect('/signin');
            }

            const { eventTitle, mandatory, optional } = req.body;

            if (!mandatory) {
                return res.status(400).render('./events/eventRegister', {
                    error: 'Partcipation consent is required.',
                    event: await Event.findOne({ title: eventTitle })
                });
            }

            const event = await Event.findOne({ title: eventTitle });

            if (!event) {
                return res.status(404).render('./events/eventRegister', {
                    error: 'Event not found.',
                    event: { title: eventTitle },
                    user: user,
                });
            }

            const isAlreadyRegistered = event.participants.some(
                (participant) => participant.userId.toString() === user._id.toString()
            );

            if (isAlreadyRegistered) {
                return res.status(400).render('./events/eventRegister', {
                    error: 'You are already registered for this event.',
                    event: event,
                    user: user,
                });
            }

            let isVolunteer = false;

            if (optional === 'true') {
                if (event.availableVolunteers > 0) {
                    isVolunteer = true;
                } else {
                    return res.status(400).render('./events/eventRegister', {
                        error: 'No volunteer slots available.',
                        event: event,
                        user: user,
                    });
                }
            }

            const participant = {
                userId: user._id,
                userName: user.userName,
                email: user.email,
                isVolunteer,
            };

            event.participants.push(participant);
            await event.save();

            return res.render('./events/eventRegister', {
                success: true,
                event: event,
                user: user,
            });
        } catch (e) {
            console.error(e);
            return res.status(500).render('./events/eventRegister', {
                error: 'An error occurred while registering for the event.',
                event: await Event.findOne({ title: req.body.eventTitle }),
                user: user
            });
        }
    });

export default router;