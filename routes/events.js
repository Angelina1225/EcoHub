import { Router } from 'express';
const router = Router();
import {Event} from '../models/Event.js';

router
    .route('/addEvent')
    .get(async (req, res) => {
        try {
            return res.render('./events/addEvent', {
                layout: 'main',
                title: 'EcoHub | Add Event',
            });
        } catch (e) {
            return res.status(500).json({error: e});
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
                    title: 'EcoHub | Add Event',
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
            return res.status(201).redirect('/events/allEvents')
            
        } catch (err) {
            if (err.name === 'ValidationError') {
                const eMsg = Object.values(err.errors).map((e) => e.message).join(', ');
                return res.render('./events/addEvent', {
                    layout: 'main',
                    title: 'EcoHub | Add Event',
                    hasError: true,
                    error: eMsg,
                });
            }
            console.log(err)
            if (err.code === 11000) {
                return res.render('./events/addEvent', { 
                    layout: 'login',
                    title: 'EcoHub | Add Event',
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
    })
    

router
    .route('/allEvents')
    .get(async (req, res) => {
        try {
            const events = await Event.find({ eventDate: { $gte: Date.now() } })
                .sort({eventDate: 1 })
                .lean();
            events.forEach((event) => {
                event.formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                event.formattedTime = new Date(event.eventDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                });
            });
            return res.render('./events/allEvents', {
                layout: 'main',
                title: 'EcoHub | Events',
                events: events
            });
        } catch (e) {
            return res.status(500).json({error: e});
        }
    })
export default router;