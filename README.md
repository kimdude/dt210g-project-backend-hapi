


## Router för användare
|Metod             |Endpoint           |Beskrivning                             |Autentisering          |Övrigt                 |
|------------------|-------------------|----------------------------------------|-----------------------|-----------------------|
|POST              |/user/register     |Skapar ny användare                     |Nej                    |                       |  
|POST              |/user/login        |Loggar in användare                     |Nej                    |                       | 
|PUT               |/profile           |Uppdaterar lösenord                     |Ja                     |                       | 
|GET               |/profile           |Hämtar specifikt spel                   |Ja                     |                       | 
|GET               |/profile/reviews   |Hämtar användarens delade recensioner   |Ja                     |                       | 
|GET               |/validate          |Validerar token                         |//                     |                       |


## Router för spel
|Metod             |Endpoint           |Beskrivning             |Autentisering          |Övrigt                               |
|------------------|-------------------|------------------------|-----------------------|-------------------------------------|
|GET               |/games             |Hämtar samtliga spel    |Nej                    |Tar query för kategori och plattform |
|GET               |/games/{id}        |Hämtar specifikt spel   |Nej                    |Tar spelets siffer id                |  


**Plattformer**
pc
browser
all

__/games?platform=pc__

**Kategorier**
mmorpg, shooter, strategy, moba, racing, sports, social, sandbox, open-world, survival, pvp, pve, pixel, voxel, zombie, turn-based, first-person, third-Person, top-down, tank, space, sailing, side-scroller, superhero, permadeath, card, battle-royale, mmo, mmofps, mmotps, 3d, 2d, anime, fantasy, sci-fi, fighting, action-rpg, action, military, martial-arts, flight, low-spec, tower-defense, horror, mmorts

__/games?category=mmorpg__

**/games?platform=pc&category=mmorpg**


## Router för recensioner
|Metod             |Endpoint                |Beskrivning             |Autentisering          |Övrigt                 |
|------------------|------------------------|------------------------|-----------------------|-----------------------|
|POST              |/games/reviews/{id}     |Lägger till recension   |Ja                     |Tar spelets siffer id  |
|PUT               |/games/reviews/{id}     |Uppdaterar recension    |Ja                     |Tar recensionens id    |
|DELETE            |/games/reviews/{id}     |Tar bort recension      |Ja                     |Tar recensionens id    |


## Router för lista med sparade spel
|Metod             |Endpoint                |Beskrivning                     |Autentisering          |Övrigt                 |
|------------------|------------------------|--------------------------------|-----------------------|-----------------------|
|GET               |/saved                  |Hämtar lista med sparade spel   |Ja                     |                       |
|POST              |/saved/{id}             |Sparar spel i listan            |Ja                     |Tar spelets siffer id  |
|DELETE            |/saved/{id}             |Tar bort spel från listan       |Ja                     |Tar spelets siffer id  |