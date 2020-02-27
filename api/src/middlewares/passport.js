import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/userModel';


passport.use('local.signin', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, (username, password, done) => {

	User.findOne({ email: username }).exec((err, user) => {
		if (err) return done(err);

		if (!user) return done(null, false, { message: 'User not registered.' });

		if (!user.validatePassword(password)) {
			return done(null, false, { message: 'Unauthorzied user.' });
		}
		else {
			return done(null, user);
		}
	});
}));