import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import logo from "../static/akpsi-logo.png"
import {APP_URL} from '../static/constants';
import signupStyle from '../styles/signup'
import brotherList from '../static/brothers';

class Signup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			gtid: '',
			errors: [],
			loading: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.UI.errors) {
			this.setState({
				errors: nextProps.UI.errors
			});
		}
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		fetch(`${APP_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name,
                GTID: this.state.gtid
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
				localStorage.setItem('user', data.user);
				this.props.history.push('/');
			} else {
				console.log(data.message);
			}
        })
        .catch(err => {
            console.log(err);
        })
	};

	render() {
		const { classes } = this.props;
		const { errors, loading } = this.state;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline/>
				<div className={classes.paper}>
					<img src={logo} alt={"logo"} 	width={300}></img>

					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							select
							id="name"
							label="Select Name"
							name="name"
							autoComplete="name"
							helperText={errors.name}
							error={errors.name ? true : false}
							onChange={this.handleChange}
						>
							
							{brotherList.map((brother) => (
								<MenuItem key={brother} value={brother}>
									{brother}
								</MenuItem>
							))}
						</TextField>

						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="GT Email Address"
							name="email"
							autoComplete="email"
							helperText={errors.email}
							error={errors.email ? true : false}
							onChange={this.handleChange}
						/>

						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="gtid"
							label="GT ID"
							type="number"
							id="gtid"
							onChange={this.handleChange}
						/>

						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							helperText={errors.password}
							error={errors.password ? true : false}
							onChange={this.handleChange}
						/>

						<TextField
							variant="outlined"
							required
							margin="normal"
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							id="confirmPassword"
							autoComplete="current-password"
							onChange={this.handleChange}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={this.handleSubmit}
                            disabled={loading || 
                                !this.state.email || 
                                !this.state.password ||
                                !this.state.name || 
								!this.state.gtid
								}
						>
							Sign Up
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link href="login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		);
	}
}

export default withStyles(signupStyle)(Signup);