/* eslint-disable import/default */
import React, { FC } from 'react';
import { Box, Link, Typography, Button } from '@mui/material';
import linkedin from '../assets/LI-In-Bug.png';

const footerStyle = {
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: '2rem',
		fontFamily: 'Lato',
		borderTop: '1px solid grey',
		paddingTop: '0.4rem',
	},
	image: {
		width: '1.6rem',
		height: '1.2rem',
		marginRight: '0.2rem',
	},
	link: {
		display: 'flex',
		textDecoration: 'none',
		flexDirection: 'row',
		padding: '0.2rem',
		color: '#000',
	},
	text: {
		fontFamily: 'Lato',
	},
};

const FooterComponent: FC = () => {
	return (
		<Box sx={footerStyle.container}>
			<Box>
				<Link
					href="https://harvesterseasons.com/"
					target="_blank"
					sx={footerStyle.link}
				>
					<Button>
						<Typography sx={footerStyle.text}>Harvester Seasons</Typography>
					</Button>
				</Link>
			</Box>
			<Link
				href="https://www.linkedin.com/showcase/harvester-seasons"
				target="_blank"
				sx={footerStyle.link}
			>
				<Button>
					<Box component="img" src={linkedin} sx={footerStyle.image} />
					<Typography component={'span'} sx={footerStyle.text}>
						Follow us on LinkedIn
					</Typography>
				</Button>
			</Link>
			<Link href="../privacy-policy/" target="_blank" sx={footerStyle.link}>
				<Button>
					<Typography sx={footerStyle.text}>
						Privacy Policy / Terms <span>of Use</span>
					</Typography>
				</Button>
			</Link>
		</Box>
	);
};

export default FooterComponent;
