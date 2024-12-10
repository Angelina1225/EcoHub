import { Router } from 'express';

const router = Router();

router.route('/donation')
    .get(async (req, res) => {
        const user = req.session.user ? req.session.user : false;

        return res.render('./donation/makeDonation', {
            layout: 'main',
            title: 'Make A Donation | EcoHub',
            user: user
        });
    })
    .post(async (req, res) => {
        const { cardName, cardNumber, cardExpiryMonth, cardExpiryYear, cardCVC, donationAmount } = req.body;

        if (cardName && cardNumber && cardExpiryMonth && cardExpiryYear && cardCVC && donationAmount > 0) {
            req.session.donated = true;

            return res.redirect('/donate/donation/thank-you-for-donating');
        } else {
            return res.send('Please provide valid input for the fields');
        }
    });

router.route('/donation/thank-you-for-donating')
    .get(async (req, res) => {
        const user = req.session.user ? req.session.user : false;
        const donated = req.session.donated;

        if (donated) {
            delete req.session.donated;

            return res.render('./donation/donationThankYou', {
                layout: 'main',
                title: 'Thank You for Your Donation | EcoHub',
                user: user
            });
        } else {
            return res.redirect('/');
        }
    });

export default router;