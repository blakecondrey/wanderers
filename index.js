const { parse } = require("csv-parse");
const fs = require("fs");

const EXOPLANET_DISPOSITION = "koi_disposition";

/*
 * https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/
 *  For an Earth-size planet orbiting a Sun-like star, this limit corresponds
 * to an Seff of about 1.11. The Seff corresponding to this inner limit of the HZ
 * would be slightly higher for planets more massive than the Earth and slightly
 * lower for stars cooler than the Sun.
 *
 * The outer limit of the HZ, as defined by Kopparapu et al., corresponds to the
 * maximum greenhouse limit beyond which a CO2-dominated greenhouse is incapable
 * of maintaining a planet’s surface temperature. The latest work suggests an
 * Seff value of about 0.36 for a Sun-like star with cooler stars having slightly
 * lower values. As with the inner limit of the HZ, there are some slightly more
 * optimistic definitions of the outer edge of the HZ such as the early-Mars scenario
 * or evoking some sort of super-greenhouse where gases other than just CO2 contribute
 * to warming a planet. But these more optimistic definitions do not change the Seff
 * for the outer limit of the HZ significantly.
 */
const INSOLATION_FLUX = "koi_insol";

/*
 * https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/
 * A series of analyses of Kepler data and follow-up observations published over the
 * last year have shown that there are limits on how large a rocky planet can become
 * before it starts to possess increasingly large amounts of water, hydrogen and helium
 * as well as other volatiles making the planet a Neptune-like world with no real
 * prospect of being habitable. Work performed by Leslie Rogers
 * (a Hubble Fellow at the California Institute of Technology)
 * has shown that planets with radii greater than no more than 1.6 times that of the Earth
 * (or RE) are most likely mini-Neptunes. This and other recent work suggests that this
 * transition corresponds to planets with masses greater than about 4 to 6 times that of the
 * Earth (or ME). As a result, planets larger or more massive than these
 * empirically-derived thresholds are unlikely to be rocky planets never mind habitable.
 */
const PLANETARY_RADIUS = "koi_prad";

const PLANET_NAMES = "kepler_name";

const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
  return (
    planet[EXOPLANET_DISPOSITION] === "CONFIRMED" &&
    planet[INSOLATION_FLUX] > 0.36 &&
    planet[INSOLATION_FLUX] < 1.11 &&
    planet[PLANETARY_RADIUS] < 1.6
  );
};

fs.createReadStream("kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(
      habitablePlanets.map((planet) => {
        return planet[PLANET_NAMES];
      })
    );
    console.log(`${habitablePlanets.length} habitable planets found.`);
  });
