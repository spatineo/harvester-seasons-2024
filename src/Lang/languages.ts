export const languages = {
  info: {
    en: "Click for information",
    fi: "Lisätietoja suomeksi"
  },
  overviewHeading: {
    en: "Overview ",
    fi: "Esittely"
  },
  overviewBody: {
    en: `Forestry operations depend on good trafficability of terrain and dirt roads on location. <a href="https://www.metsakeskus.fi/en" target=_blank>The Finnish Forest Centre<a/> has produced trafficability maps based on high resolution laser scanning of most parts of Finland. These maps call for dry or winter coditions for many forests in Finland to be trafficable. Our app gives a 6 month foresight identifying good or bad conditions within the 6 classes of the trafficability map.`,
    fi: `Jo muutaman vuoden saatavilla olleet <a href="https://www.metsakeskus.fi/en" target="_blank">Metsäkeskuksen</a> tarjoamat korjuukelpoisuuskartat kattavat yli 80 % Suomen metsämaasta. Uusi Harvester Seasons -palvelumme antaa kuuden kuukauden ennusteen hyvistä ja huonoista korjuuolosuhteista kuuden korjuukelpoisuusluokan kannalta. Toisin sanoen, korjuukelpoisuuskarttojen esittämään tietoa täydennetään sää- ja ilmastotiedoilla, jolloin korjuukelpoisuuskarttojen esittämästä korjuukelpoisuudesta saadaan ajankohtaan paremmin osuva.`
  },
  howTo: {
    en: `How to use`,
    fi: `Käyttöohje`
  },
  instructions: {
    one: {
      en: ``,
      fi: `Kun avaat Harvester Seasons -sivuston, sivusto kysyy mahdollisuutta käyttää sijaintiasi. Voit hyväksyä sijainnin käytön, jolloin kartta kohdentuu sijaintiisi käyttäessäsi ohjelmaa älylaitteella, tai itse kohdentaa haluamaasi paikkaan kartalla.`
    },

    two: {
      en: `When you open the page it can use your location information to zoom in on the surrounding area and show the 6 month forecast for it in a graph with summer and winter condition analysis. The blue circle indicates the area where the graph information is valid. You can navigate the date on the map below with a slider, back and forward buttons or play to go through all dates.`,
      fi: `Tarkenna kartta haluamaasi maastonkohtaan ja klikkaa hiirellä tai kosketa sormella sininen osoitinmerkki alueelle. Tällöin ohjelman tekee laskelman (kestää hetken) maaperän kosteudesta, roudasta ja lumen syvyydestä alueelle.`
    },
		three: {
			en: ``,
			fi: `Zoomaa takaisin lähelle sinistä osoitinmerkkiä. Leimikkotasolla näkyvässä perustilanteessa on esillä perinteisen korjuukelpoisuuskartan esittämä tieto alueen korjuukelpoisuudesta.`
		},
		four: {
			en:``,
			fi: `Kun laitat ruksin Trafficability forecast -kohtaan kartan ylälaidassa, Play-toiminto aktivoituu ja voit tarkastella karttaruudun aikajanalla kelaten korjuukelpoisuusarviota eteenpäin seuraavalle kuudelle kuukaudelle sää- ja ilmasto-olosuhteet huomioiden. Voit ohjata kartan päivämäärää myös liukukytkimellä sekä eteen- ja taaksepäin painikkeilla.`
		},
		five: {
			en: ``,
			fi: `Kartan yläpuolella kuvaajassa on kaksi indeksiä (Summer Index ja Winter Index), jotka kuvaavat kohteen korjuukelpoisuutta kesä- ja talvitilanteiden kannalta asteikolla hyvä, epävarma (keskellä asteikkoa) ja huono.`
		}
  },
  mapTextOne: {
    en: ``,
    fi: `Laskelma tehdään sinisen ympyrän alueen sää- ja ilmastotietojen perusteella (zoomaa leimikkotasolta kauemmaksi, jotta näet sinisen ympyrän.)`
  },
  mapTextTwo: {
    en: ``,
    fi: `arttaikkunan oikeasta yläkulmassa olevasta valikosta voit valita karttatasoja maaperän kosteuden, maaperän lämpötilan, lumen paksuuden ja metsäpaloindeksin tarkastelemiseksi. Karttatasot toimivat vain riittävän isolla mittakaavalla tarkasteltaessa.`
  },
	mapTextInstructionFive1: {
		en: ``,
		fi: `Summer Index muodostetaan maan pintakerroksen (0 – 28 cm) kosteuden perusteella. Arvo on Hyvä, jos maaperän kosteusprosentti on pienempi kuin 40 %. Menneet päivämäärät sekä tulevat ensimmäiset 10 päivää perustuvat vuodenaikaisennusteen sijaan lyhyemmän aikavälin sääennusteeseen, ja johtuen ennusteiden erosta maakerroksen syvyydessä, käytössä on tällöin maankosteuden osalta 20 % raja-arvo.`
	},
	mapTextInstructionFive2: {
		en: ``,
		fi: `Winter Index muodostetaan lumikerroksen paksuuden ja maaperän lämpötilan perusteella. Arvo on Hyvä, jos lunta on yli 40 cm tai routaa 20 cm.`
	},
	feedBack: {
		en: `Send feedback`,
		fi: `Lähetä palautetta`
	},
	feedbackPlaceholder: {
		en: `Feedback`,
		fi: `Paluate`
	},
	email: {
		en: `E-mail address or phone number`,
		fi: `Sähköpostiosoite tai puhelinnumero`
	},
	descriptionHeader: {
		en: `Description`,
		fi: `Kuvaus`
	},
	descriptionTextP1: {
		en: `Each date map translates the forecasted indexes into changes to trafficability classes on the map for that day. Good winter conditions allow forest machines in all terrains, good summer conditions leave out winter classes. Bad conditions are identified for areas that need dry or winter conditions and these are not predicted. Seasonal forecasts are far from certain, so we also have situations where we can't predict conditions.`,
		fi: `Jokaisen päivän kartalla ennustetut indexit vaihtavat korjuukelpoisuus luokitusta hyväksi tai huonoksi. Hyvät talviolosuhteet sallivat korjuun kaikialla, hyvät kuivat kesätilanteet sallivat korjuun muualla kuin talviluokissa. Huonoja olosuhteita esitetään kuivuutta tai talviolosuhteita edellyttävissä paikoissa, jos olosuhteita ei ennusteta. Vuodenaikaisennusteet eivät ole luotettavia kuten sääennusteet, siksi on myös tilanteita, joissa emme tohdi ennustaa olosuhteita.`
	},
	descriptionTextP2: {
		en: `Below the map three graphs go into detail explaining the conditions background. The predictions use <a href="https://climate.copernicus.eu/seasonal-forecasts" target="_blank">EU Copernicus climate change service seasonal forecasts</a> using the <a href="https://cds.climate.copernicus.eu/#!/home" target="_blank">Copernicus climate data store</a>, which are a tool combining climatology and large scale weather pattern teleconnections to indicate directions of future climate. So graphs are not daily weather forecasts, but a range of possibilities for each day and our analysis is based on 90% of these to concure on a good or bad condition. The graphs show all 51 members of the bias-adjusted and post processed prediction ensemble interpolated to the location on the map. It represents many square kilometres, not one spot as the resolution of the models used ranges from 5 to 100 kilometers. The red lines represent short term weather forecasts by FMI. The soil moisture forecast is for a deeper layer than in seasonal predictions and thus shows smaller values.`,
		fi: `Kartan alla kolme kuvaajaa selittää olosuhde-ennusteiden taustaa. Ennusteet perustuvat<a href="https://climate.copernicus.eu/seasonal-forecasts" target="_blank"> EU:n Copernicus ilmastonmuutospalveluiden vuodenaikaisennusteisiin</a> , jotka ovat saatavilla <a href="https://cds.climate.copernicus.eu/#!/home" target="_blank">Copernicus ilmastodatapalvelusta</a>. Vuodenaikaisennusteet ovat väline, joka yhdistää ilmastotietoa ja suursään kaukokulkeutumisyhteyksiä kuvaamaan tulevaa ilmastoa. Kuvaajat eivät siis ole päivittäisiä sääennusteita, vaan jakauma mahdollisuuksia kullekin päivälle. Meidän ennuste perustuu tilanteisiin, joissa 90 % jakauman jäsenistä puoltavat hyviä tai huonoja olosuhteita. Kuvaajissa näkyy kaikki 51 arvoa biaskorjattuja ja jatkojalostettuja ennusteen parven jäsentä interpoloituna kohteeseen. Tieto edustaa useiden neliökilometrien alueellista tilannetta, eivät pientä paikkaa kartalla, koska käytettyjen mallien erotuskyvyt liikkuvat 5 ja 100 kilometrin välillä. Punaiset viivat edustavat Ilmatieteen laitoksen sääennustetta. Maankosteuden ennuste edustaa syvempää kerrosta kuin vuodenaikaisennusteessa, mistä syystä se myös näyttää pienempiä arvoja.`
	},
	descriptionTextP3: {
		en: `Summer good/dry conditions are based on soil wetness below 10 cm ground being under 40% with 90% of prediction members. Winter good conditions are either based on soil temperature at 20 cm below ground being under 0 °C or snow depth being more than 40 cm. Again 90% of the prediction members have to agree. Past dates and the coming first 10 days are using short term weather forecast instead of seasonal prediction, and also 20% limit for soil moisture because of a different soil layer depth.`,
		fi: `Kesän hyvät/kuivat olosuhteet perustuvat maaperän kosteuteen 10 cm syvyyden alapuolella. Vettä on oltava alle 40 % maaperän tilavuudesta ja vähintään 90 % ennusteparven jäsenistä on ennustettava niin. Talven hyvät olosuhteet perustuvat joko routaan, jolloin 20 cm syvyydellä maaperän lämpötila on pakkasella tai lumensyvyyteen, jonka on oltava yli 40 cm. Ja siis 90 % parven ennusteista on oltava samaa mieltä. Menneet päivämäärät sekä tulevat ensimmäiset 10 päivää perustuvat vuodenaikaisennusteen sijaan lyhyemmän aikavälin sääennusteeseen, ja johtuen ennusteiden erosta maakerroksen syvyydessä, käytössä on tällöin maankosteuden osalta 20 % raja-arvo.`
	},
	descriptionTextP4: {
		en: `The app allows browsing the map and clicking for analysis graphs all over Northern Europe, but trafficability analysis is available only in Finland with over 80% of land area covered. In areas without trafficability analysis the map shows average soil wetness, temperature and snow depth predictions, but the information is intended to be coarse as this information should not be considered precise, it is estimating future climatology of the variable. Also good and bad trafficability is analyzed in the graphs, but it can't be translated for particular parcels on the map.`,
		fi:`Sovellus sallii kartan selaamisen ja analyysin laskemisen Pohjoismaissa, mutta korjuukelpoisuus analyysia on vain Suomessa (yli 80 % metsämaista on kartoitettu). Alueilla ilman korjuukelpoisuuskartta ja zoomaamalla suuria alueita voi tarkastella ennusteparven keskimääräistä maaperän kosteutta, lämpötilaa tai lumikerroksen paksuutta. Tieto on tarkoituksella epämääräistä, koska kyseessä on muuttujan tulevan ilmaston arvio. Kuvaajiin analysoidaan myös hyvät ja huonot korjuukelpoisuudet, mutta niitä ei voi esittää kartalla maastoa huomioiden.`,
	},
	descriptionTextP5: {
		en:`The service is developed with EU support and it allows this service to be available for free for a one year trial phase. You can send feedback using the form above. Enjoy!`,
		fi: `Palvelu on kehitetty EU:n tukemana ja tämä tarjoaa mahdolisuuden käyttää palvelua ilmaiseksi aina vuoden kestävän koekauden ajan. Voit lähettää palautetta yllä olevan lomakkeen avulla. Tervetuloa!`
	},
	viewSheet: {
		en: `<ahref="https://harvesterseasons.com/altcolors/HarvesterSeasons_Description2pager_v2.pdf" target="_blank" rel="noreferrer">View infosheet (PDF)</a>`,
		fi: ``
	},
	carbonEmmison: {
		en: `<a href="https://harvesterseasons.com/altcolors/infotext_Carbon_HarvesterSeasons_eng.pdf" target="_blank" rel="noreferrer">Carbon emissions and forest operations: A short guideline for the forestry sector (PDF)</a>`,
		fi:`<a href="https://harvesterseasons.com/altcolors/infotext_Carbon_HarvesterSeasons_fin.pdf" target="_blank" rel="noreferrer">Carbon emissions and forest operations: A short guideline for the forestry sector (PDF, Suomeksi)</a>`,
	},
	forestFires: {
		en: `Forest Fire Index is provided by <a href="https://effis.jrc.ec.europa.eu/" target="_blank" rel="noreferrer">Copernicus Emergency Management Service.</a>`,
		fi: `Metsäpaloindeksin (Forest Fire Index) tuottaa <a href="https://effis.jrc.ec.europa.eu/" target="_blank" rel="noreferrer"> Copernicus Emergency Management Service.</a>`
	},
	treeCoverDensity: {
		en: `Tree Cover Density is for year 2018 and provided by <a href="https://land.copernicus.eu/pan-european/high-resolution-layers/forests/" target="_blank" rel="noreferrer"> Copernicus Land Monitoring Service.</a>`,
		fi: `Latvuspeittävyys (Tree Cover Density) on vuodelle 2018 ja sen tuottaa <a href="https://land.copernicus.eu/pan-european/high-resolution-layers/forests/" target="_blank" rel="noreferrer"> Copernicus Land Monitoring Service.</a>`
		},
	partners: {
		en: `Project partners`,
		fi: `Projektin osapuolet`
	},
	serviceProvider: {
		en: `Service provider`,
		fi: `Palveluntuottajat`
	},
	contractor: {
		en: `Subcontractor`,
		fi: `Alihankkija`
	},
	testUser: {
		en: `Test User`,
		fi: `Testiasiakas`
	},
	service: {
		en: `This service is funded by`,
		fi : `Tätä palvelua rahoittaa`
	},
	italicEnglishText1: {
		en: `This service is funded as a use case by the Destination Earth (DestinE) initiative of the European Commission under framework agreement ECMWF/DESTINE/2022/DE_370d_FMI.`,
		fi: `Tätä palvelua rahoitetaan Euroopan komission Destination Earth (DestinE) Use Case palvelusopimuksella osana puitesopimusta ECMWF/DESTINE/2022/DE_370d_FMI.`
	},
	italicEnglishText2: {
		en: `This service was funded as a use case by the Copernicus Programme's Climate Change Service (C3S) contract under framework agreement ECMWF/COPERNICUS/2019/C3S_428g_FMI.`,
		fi: `Tämä palvelu rahoitettiin Copernicus Climate Change Service (C3S) Use Case palvelusopimuksella osana puitesopimusta ECMWF/COPERNICUS/2019/C3S_428g_FMI.`
	},
	italicEnglishText3: {
		en: `The E-Shape project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement 820852.`,
		fi: `E-Shape projekti on saanut rahoitusta Euroopan Unionin Horisontti 2020 tutkimus- ja innovaatio-ohjelmasta sopimusnumerolla 820852.`
	},
	soilCarbon: {
    en: `Boreal forest soil is an immense storage of carbon (Crowther et al. 2019). The cold climate of the boreal region leads to slow and partial decomposition of dead plant material i.e. litter (Pan et al. 2011). Mineral soil consists of several layers with forest floor being on the top. Forest floor includes the litter layer, with organic residues such as leaves, branches, bark, and stems, and the finely textured organic humus layer. The mineral soil below the forest floor is generally stratified into various layers as well. The most common soil types in Finnish forests are different types of Podzols and Histosols (peat) (Tamminen 2009). In peat soils, the more decomposed layers are located deeper in the peat and less decomposed on the top. When undisturbed, the soil C storage in forests on mineral soil generally grows at a relatively steady pace, making them sinks of carbon. In forests growing on drained peatlands, the soil is usually a source of carbon to the atmosphere (Lehtonen et al. 2011, Suomen kasvihuonekaasupäästöt 1990-2020). Different natural and anthropogenic changes such as the warming air and soil temperatures or forest management operations can change the soil carbon storage.`,
    fi: ``
  },
  forestManagement: {
    en: `Clearcutting usually reduces soil carbon stock in the long-term. In forests on mineral soil, this reduction occurs especially in the forest floor and the uppermost mineral soil layer. If the harvesting residues are left on site, the carbon stock in the forest floor is often larger compared to untreated forest directly after clearcutting (e.g. Mayer et al. 2020). The effect has been found to last about 5-10 years (Howard et al. 2004, Falsone et al. 2012, Piirainen et al. 2012, Kishchuk et al. 2016, Strukelj et al. 2015). On the other hand, the residues left on the site start decomposing, which means that they release CO2 to the atmosphere (Mattson et al. 1987). This release is in any case slower than what the release would be if the residuals were, for instance, burned for bioenergy purposes, but faster if the stand would not have been cut. In general, a clear- cut stand becomes a net source of C to the atmosphere, because the soil carbon storage and possible residues release CO2 to the atmosphere and there are no trees to photosynthesize and compensate this loss. The effect may last up to 20 years (Pypker & Fredeen 2002, Rannik et al. 2002, Kolari et al. 2004, Fredeen et al. 2007, Mäkiranta et al. 2010). When residues are collected away from the forest site, also nutrients that would normally enter the forest soil are removed (Clarke et al. 2015, Lim et al. 2020). This could lead to slower tree growth, reduced litter input to the soil and reduced ability of trees to sequester carbon (Clarke et al. 2015). For this reason the Best Practices (for Sustainable Forest Management) in Finland advice to not remove the residues from stands where the nutrient status is low (https://metsanhoidonsuositukset.fi/en). For the same reason, when the residues are removed, they are first left for 2-4 weeks to dry and shed their needles. Following such practice may lead to smaller nutrient losses (Clarke et al. 2015).

		The carbon stock in the forest floor is more susceptible to changes than the deeper soil layers. Several studies have reported that the total soil carbon stock (i.e. the stock of forest floor + mineral soil) does not necessarily change with removing residues (Hazlett et al. 2007, Hume et al. 2018, Morris et al. 2019, Lim et al. 2020). However, the carbon stock of the forest floor alone has been shown to decrease after clear-cut with residue removal compared to cased cases where residue was left on site (Clarke et al. 2015, James & Harrison 2016, Clarke et al. 2021). Similarly the soil preparation methods used after clear-cut can also reduce the C storage of forest floor (James & Harrison 2016), while other soil layers are not significantly affected (Jandl et al. 2007, James & Harrison 2016, Mayer et al. 2020). The improved growth of trees may is suggested to balance or outweigh the carbon losses in the ecosystem level (Jandl et al. 2007, Mayer et al. 2020). The effects of soil preparation methods on soil carbon also depend on the intensity of the chosen method. For instance, if also stumps are removed, the carbon stock of the mineral soil may decrease significantly compared to cases where only stems are harvested (Achat et al. 2015).`,
    fi: ``
  },
  petland: {
    en: `Unfortunately, there is not yet much information available about soil carbon on drained and forested peatlands. The topic has gathered increasing information among scientists, though, and there are projects related to it going on at least in the University of Helsinki, Natural Resources Institute Finland Finnish Meteorological Institute.

		In general, water level plays a much more important role in the decomposition and the carbon dynamics of peatland forests compared to forests on mineral soil. Decomposition requires air, which is not available with high ground water levels. Also the growth of trees requires air so that the roots do not drown. To create more favorable conditions for trees, drainage has been used in peatland forestry. Drainage generally increases decomposition rate and, thus decreases the soil carbon stock (Drzymulska 2016, Maljanen et al. 2010, Ojanen et al. 2013), but the increased growth rates of trees may compensate this loss on the stand carbon stock level (Minkkinen et al. 2001). A clear-cut at a drained peatland forest leads to raised water table level because of diminished transpiration when trees are removed (Sarkkola et al. 2010). This could lead into slower decomposition and release of carbon as methane (CH4) as the conditions in peat are waterlogged. On the other hand, a recent study in a Finnish drained peatland forest (Korkiakoski et al. 2019) showed that the CO2 emissions greatly increased after a clear-cut (residues were left on the site). The reason for this was reported to be that the loss of photosynthesizing trees and ground vegetation was too much to compensate the decomposition of logging residues and peat.

		The increased water level following a clear-cut at drained peatland forests often leads to a need of opening/clearing the ditches in order to decrease the water level so that the seedlings and their roots do not drown. This again increases the decomposition rate and loss of soil C stock. There is, again oxygen available to the decomposing microbes and the seedlings cannot photosynthesize carbon at the same rate than the decomposition process releases it. Continuous cover forestry practices at drained peatland forests could help remaining the water level relatively stable, which could also decrease the loss of carbon from these soils. However, research related to this is currently ongoing and C stocks, sinks and exchange processes in ditched, reforested and clear-cut or unharvested stands are being intensively studied (e.g. Luke, FMI experimental field sites).
		`,
    fi: ``
  },
  literature: {
    en: `Achat, D.L., Deleuze, C., Landmann, G., Pousse, N., Ranger, J. & Augusto, L. 2015. Quantifying consequences of removing harvesting residues on forest soils and tree growth – A meta-analysis. Forest ecology and management 348: 124–141.

	Crowther, T., J. van den Hoogen, J. Wan, M. Mayes, A. Keiser, L. Mo, C. Averill and D. Maynard (2019). The global soil community and its influence on biogeochemistry. Science 365: 772.
	 
	Clarke, N., Gundersen, P., Jönsson-Belyazid, U., Kjønaas, O.J., Persson, T., Sigurdsson, B.D., Stupak, I. & Vesterdal, L. 2015. Influence of different tree- harvesting intensities on forest soil carbon stocks in boreal and northern temperate forest ecosystems. Forest ecology and management 351: 9–19.
	
	Clarke, N., Kiær, Lars P., Janne K.O., Bárcena, T.G., Vesterdal, L., Stupak, I., Finér, L., Jacobson, S., Armolaitis, K., Lazdina, D., Stefánsdóttir, H.M. & Sigurdsson, B.D. 2021. Effects of intensive biomass harvesting on forest soils in the Nordic countries and the UK: A meta-analysis. Forest ecology and management 482: 118877.
	
	Drzymulska, D. 2016. Peat decomposition – Shaping factors, significance in environmental studies and methods of determination; A literature review, Geologos, 22, 61–69.
	
	Falsone, G., Celi, L., Caimi, A., Simonov, G. & Bonifacio, E. 2012. The effect of clear cutting on podzolisation and soil carbon dynamics in boreal forests (Middle Taiga zone, Russia). Geoderma 177–178: 27–38.
	
	Fredeen, A. L., Waughtal, J. D., and Pypker, T. G. 2007. When do replanted sub-boreal clearcuts become net sinks for CO2?, Forest Ecology and Management, 239, 210–216.
	
	Hazlett, P.W., Gordon, A.M., Voroney, R.P. & Sibley, P.K. 2007. Impact of harvesting and logging slash on nitrogen and carbon dynamics in soils from upland spruce forests in northeastern Ontario. Soil biology & biochemistry 39(1): 43–57.
	
	Howard, E.A., Gower, S.T., Foley, J.A. & Kucharik, C.J. 2004. Effects of logging on carbon dynamics of a jack pine forest in Saskatchewan, Canada. Global change biology 10(8): 1267–1284.
	
	Hume, A.M. Chen, H.Y.H. & Taylor, A.R. 2018. Intensive forest harvesting increases susceptibility of northern forest soils to carbon, nitrogen and phosphorus loss. The Journal of applied ecology 55(1): 246–255.
	
	James, J. & Harrison, R. 2016. The effect of harvest on forest soil carbon: A meta-analysis. Forests 7(12): 308.
	
	Jandl, R., Lindner, M., Vesterdal, L., Bauwens, B., Baritz, R., Hagedorn, F., Johnson, D.W., Minkkinen, K. & Byrne, K.A. 2007. How strongly can forest management influence soil carbon sequestration? Geoderma 137(3): 253–268.
	
	Kishchuk, B.E., Morris, D.M., Lorente, M., Keddy, T., Sidders, D., Quideau, S., Thiffault, E., Kwiaton, M. & Maynard, D. 2016. Disturbance intensity and dominant cover type influence rate of boreal soil carbon change: A Canadian multi-regional analysis. Forest Ecology and Management 381: 48–62.
	
	Kolari, P., Pumpanen, J., Rannik, Ü., Ilvesniemi, H., Hari, P.,and Berninger, F. 2004. Carbon balance of different aged Scots pineforests in Southern Finland, Glob. Change Biol., 10, 1106–1119.
	
	Korkiakoski M., Tuovinen J-P, Penttilä T., Sarkkola S., Ojanen P., Minkkinen K., Rainne J., Laurila T. and Lohila A. 2019. Greenhouse gas and energy fluxes in a boreal peatland forest after clear-cutting. Biogeosciences 16: 3703–3723.
	
	Lehtonen A., Puolakka P., Ihalainen A., Heikkinen J., and Korhonen K.T. 2011. Metsähallituksen hallinnoimien metsien hiilitaseet. Working papers of the Finnish Forest Research Institute/Metlan työraportteja 199. 24 pp.
	
	Lim, H., Olsson, B.A., Lundmark, T. & Dahl, J. 2020. Effects of whole-tree harvesting at thinning and subsequent compensatory nutrient additions on carbon sequestration and soil acidification in a boreal forest. GCB Bioenergy 12: 992–1001.
	
	Maljanen, M., Sigurdsson, B. D., Guðmundsson, J., Óskarsson, H., Huttunen, J. T., and Martikainen, P. J. 2010. Greenhouse gas balances of managed peatlands in the Nordic countries – present knowledge and gaps, Biogeosciences, 7, 2711–2738
	
	Mattson K G, Swank W T and Waide J B 1987 Decomposition of woody debris in a regenerating, clear-cut forest in the Southern Appalachians. Can. J. For. Res. 17, 712–721.
	
	Mayer, M., Prescott, C.E., Abaker, W.E.A., Augusto, L., Cécillon, L., Ferreira, G.W.D., James, J., Jandl, R., Katzensteiner, K., Laclau, J.-P., Laganière, J., Nouvellon, Y., Paré, D., Stanturf, J.A., Vanguelova, E.I. & Vesterdal, L. 2020. Tamm Review: Influence of forest management activities on soil organic carbon stocks: A knowledge synthesis. Forest ecology and management 466: 118127.
	
	Minkkinen, K., Laine, J., and Hökkä, H. 2001. Tree stand development and carbon sequestration in drained peatland stands in Finland – a simulation study, Silva Fennica, 35, 55–69.
	
	Morris, D.M., Hazlett, P.W., Fleming, R.L., Kwiaton, M.M., Hawdon, L.A., Leblanc, J.‐D., Primavera, M.J. & Weldon, T.P. 2019. Effects of biomass removal levels on soil carbon and nutrient reserves in conifer-dominated, coarse-textured sites in northern Ontario: 20-year results. Soil Science Society of America journal 83(S1): S116–S132.
	
	Mäkiranta, P., Riutta, T., Penttilä, T., and Minkkinen, K. 2010. Dynamics of net ecosystem CO2 exchange and heterotrophic soil respiration following clearfelling in a drained peatland forest, Agr. Forest Meteorol., 150, 1585–1596.
	
	Ojanen, P., Minkkinen, K., and Penttilä, T. 2013. The current greenhouse gas impact of forestry-drained boreal peatlands, Forest Ecology and Management, 289, 201–208.
	
	Pan, Y., R. A. Birdsey, J. Fang, R. Houghton, P. E. Kauppi, W. A. Kurz, O. L. Phillips, A. Shvidenko, S. L. Lewis, J. G. Canadell, P. Ciais, R. B. Jackson, S. W. Pacala, A. D. McGuire, S. Piao, A. Rautiainen, S. Sitch and D. Hayes (2011). A large and persistent carbon sink in the world’s forests. Science 333: 988–993.
	
	Piirainen, S., Finér, L. & Starr, M. 2015. Changes in forest floor and mineral soil carbon and nitrogen stocks in a boreal forest after clear-cutting and mechanical site preparation. European Journal of Soil Science 66: 735–743.

	Rannik, Ü., Altimir, N., Raittila, J., Suni, T., Gaman, A., Hussein, T., Hölttä, T., Lassila, H., Latokartano, M., Lauri, A., Natsheh, A., Petäjä, T., Sorjamaa, R., Ylä-Mella, H., Keronen, P., Berninger, F., Vesala, T., Hari, P., and Kulmala,M. 2002. Fluxes of carbon dioxide and water vapour over Scots pine forest and clearing, Agricultural and Forest Meteorology, 111, 187–202.
	
	Sarkkola, S., Hökkä, H., Koivusalo, H., Nieminen, M., Ahti, E., Päivänen, J., and Laine, J. 2010. Role of tree stand evapotranspiration in maintaining satisfactory drainage conditions in drained peatlands, Canadian Journal of Forest Research, 40, 1485–1496.
	
	Strukelj, M., Brais, S. & Paré, D. 2015. Nine-year changes in carbon dynamics following different intensities of harvesting in boreal aspen stands. European Journal of Forest Research 134: 737–754.

	Suomen kasvihuonekaasupäästöt 1990 – 2020. Tilastokeskus / Statistics Finland, Helsinki, 2021, 111 pp.
	
	Tamminen, P. 2009. Suomen metsämaiden maannokset. Metsätieteen aikakauskirja 1: 74–78.`,
    fi: ``
  }
};
