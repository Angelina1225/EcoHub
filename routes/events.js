import { Router } from 'express';
import Event from '../models/Event.js';

const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {
            // Get user session
            const user = req.session.user;

            // Get the search term
            const searchTerm = req.query.query || '';

            let events;

            // Get events matching search term or return all upcoming events
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

            // Format event date and time
            events.forEach((event) => {
                event.eventFormattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
                    month: 'long',
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
            // Get user session
            const user = req.session.user;

            if (user) {
                return res.render('./events/addEvent', {
                    layout: 'main',
                    title: 'Add Event | EcoHub',
                    user: user
                });
            }

            return res.render('./users/login', {
                layout: 'login',
                title: 'Sign In | EcoHub'
            });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {
        try {
            const { title, description, eventDate, eventTime, place, requiredVolunteer, volunteersNeeded } = req.body;

            const fullDate = new Date(`${eventDate}T${eventTime}`);

            const existingEvent = await Event.findOne({
                title,
                description,
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
            console.log(err)
            
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

export default router;