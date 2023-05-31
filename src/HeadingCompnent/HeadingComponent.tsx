// eslint-disable-next-line import/default
import React, { useState } from 'react';
import { Box, Collapse, ListItemButton, Typography } from '@mui/material';
import { LanguageOptions } from '../Lang/languageSlice';
import { languages } from '../Lang/languages';
import { useAppSelector } from '../store/hooks';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import logo from '../assets/logo.png';
import testimonial from '../assets/testimonial_metsateho1.png';

const HeadingCompoment: React.FC = () => {
	const [open, setOpen] = useState(false);
	const information = useAppSelector((state) => state.language);

	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<Box>
			<Box style={{ marginTop: '1rem', fontFamily: 'Lato' }}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						fontFamily: 'Lato',
					}}
				>
					<Typography variant="h4">Harvester Seasons!</Typography>
					<Box component="img" src={logo} sx={{ width: '20rem' }} />
				</Box>
				<Box>
					<ListItemButton onClick={handleClick} style={{ paddingLeft: '0px', width: '26%' }}>
						{open ? <ExpandLess /> : <ExpandMore />}{' '}
						{languages.info[information.en as keyof LanguageOptions]}
					</ListItemButton>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ width: '80%', margin: '2rem auto' }}>
							<Box component="img" src={testimonial} sx={{ width: '80%' }} />
						</Box>
						<Box>{languages.overviewBody[information.en as keyof LanguageOptions]}</Box>
					</Collapse>
				</Box>
			</Box>
		</Box>
	);
};

export default HeadingCompoment;
