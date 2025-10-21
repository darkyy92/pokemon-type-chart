#!/usr/bin/env python3
"""
Fix missing species fields in trainers.json by matching movesets to Pokemon species.
Based on comprehensive Serebii data from Pokemon Legends Z-A Z-A Royale trainer battles.
"""

import json
from typing import Dict, List, Set, Tuple
from pathlib import Path


# Comprehensive Pokemon moveset database from Serebii Z-A Royale data
POKEMON_MOVESETS = {
    # Rank Z Pokemon
    "Pikachu": {
        "Quick Attack", "Growl", "Thunder Wave", "Thunder Shock", "Thunderbolt",
        "Electro Ball", "Spark"
    },
    "Pidgey": {
        "Tackle", "Growl", "Gust", "Sand Attack", "Quick Attack"
    },
    "Slowpoke": {
        "Water Gun", "Growl", "Tackle", "Confusion", "Yawn", "Disable", "Headbutt"
    },
    "Weedle": {
        "Poison Sting", "String Shot", "Bug Bite"
    },
    "Bellsprout": {
        "Vine Whip", "Growth", "Wrap", "Acid"
    },
    "Bunnelby": {
        "Tackle", "Leer", "Mud Shot", "Quick Attack", "Double Slap", "Take Down"
    },
    "Fletchling": {
        "Growl", "Peck", "Quick Attack", "Ember", "Agility"
    },
    "Mareep": {
        "Tackle", "Growl", "Thunder Shock", "Thunder Wave", "Cotton Spore"
    },
    "Kakuna": {
        "Poison Sting", "String Shot", "Harden", "Bug Bite"
    },
    "Pidgeotto": {
        "Tackle", "Gust", "Quick Attack", "Twister", "Sand Attack", "Whirlwind",
        "Wing Attack", "Feather Dance"
    },
    "Onix": {
        "Tackle", "Harden", "Rock Throw", "Dragon Breath", "Bind", "Curse",
        "Rock Polish", "Stealth Rock"
    },

    # Rank Y Pokemon
    "Spritzee": {
        "Fairy Wind", "Fake Tears", "Disarming Voice", "Sweet Scent", "Aromatherapy",
        "Draining Kiss", "Charm"
    },
    "Swirlix": {
        "Tackle", "Charm", "Fairy Wind", "Fake Tears", "Sweet Scent", "Draining Kiss"
    },
    "Vivillon": {
        "Light Screen", "Infestation", "Gust", "Draining Kiss", "Psybeam",
        "Struggle Bug", "Poison Powder", "Sleep Powder", "Supersonic"
    },
    "Spinarak": {
        "Poison Sting", "String Shot", "Absorb", "Infestation", "Night Shade",
        "Scary Face", "Constrict"
    },
    "Venipede": {
        "Poison Sting", "Leer", "Rollout", "Protect", "Defense Curl", "Poison Tail",
        "Pin Missile", "Screech", "Spikes"
    },
    "Ralts": {
        "Growl", "Disarming Voice", "Confusion", "Hypnosis", "Double Team",
        "Teleport", "Draining Kiss", "Psybeam"
    },
    "Pichu": {
        "Growl", "Thunder Shock", "Quick Attack", "Thunder Wave", "Sweet Kiss",
        "Charm", "Nasty Plot"
    },

    # Rank X Pokemon
    "Furfrou": {
        "Take Down", "Bite", "Thunder Fang", "Fire Fang", "Headbutt", "Tail Whip",
        "Sand Attack", "Sucker Punch", "Roar", "Fire Spin", "Ice Fang"
    },
    "Kadabra": {
        "Confusion", "Psybeam", "Shadow Ball", "Reflect", "Teleport", "Disable",
        "Ally Switch", "Psyshock", "Kinesis"
    },
    "Roselia": {
        "Magical Leaf", "Razor Leaf", "Sleep Powder", "Spikes", "Poison Sting",
        "Mega Drain", "Stun Spore", "Absorb", "Growth"
    },

    # Rank W Pokemon
    "Simisear": {
        "Flame Wheel", "Ember", "Bite", "Protect", "Lick", "Fury Swipes",
        "Fire Blast", "Incinerate", "Yawn"
    },
    "Simipour": {
        "Bubble Beam", "Water Gun", "Bite", "Protect", "Lick", "Fury Swipes",
        "Scald", "Aqua Tail"
    },
    "Simisage": {
        "Vine Whip", "Magical Leaf", "Bite", "Protect", "Lick", "Fury Swipes",
        "Seed Bomb", "Energy Ball"
    },

    # Rank V Pokemon
    "Drampa": {
        "Twister", "Icy Wind", "Glare", "Safeguard", "Dragon Breath", "Dragon Pulse",
        "Light Screen", "Extrasensory"
    },
    "Buneary": {
        "Quick Attack", "Brutal Swing", "Draining Kiss", "Charm", "Pound",
        "Defense Curl", "Baby-Doll Eyes", "Dizzy Punch"
    },
    "Absol": {
        "Aqua Jet", "Whirlpool", "Night Slash", "Slash", "Quick Attack",
        "Pursuit", "Detect", "Taunt", "Razor Wind", "Feint", "Psycho Cut",
        "Sucker Punch"
    },
    "Hippopotas": {
        "Curse", "Sand Tomb", "Dig", "Crunch", "Tackle", "Sand Attack", "Bite",
        "Yawn"
    },
    "Sandile": {
        "Leer", "Sand Tomb", "Bite", "Dig", "Rage", "Sand Attack", "Assurance",
        "Mud-Slap", "Crunch"
    },

    # Rank F Pokemon
    "Dedenne": {
        "Discharge", "Volt Switch", "Eerie Impulse", "Crunch", "Parabolic Charge",
        "Swift", "Bulldoze", "Tackle", "Tail Whip", "Thunder Shock", "Charge",
        "Nuzzle", "Thunder Wave"
    },
    "Helioptile": {
        "Discharge", "Spark", "Mud Shot", "Charge", "Pound", "Tail Whip",
        "Thunder Shock", "Quick Attack", "Parabolic Charge"
    },
    "Ampharos": {
        "Discharge", "Dragon Pulse", "Power Gem", "Cotton Guard", "Thunder Shock",
        "Growl", "Thunder Wave", "Cotton Spore", "Thunder Punch", "Electro Ball",
        "Confuse Ray", "Signal Beam", "Light Screen"
    },

    # Rank E Pokemon
    "Falinks": {
        "No Retreat", "Brick Break", "Iron Head", "Rock Slide", "Headbutt",
        "Rock Smash", "Protect", "Bulk Up", "Megahorn"
    },
    "Machop": {
        "Brick Break", "Brutal Swing", "Bulldoze", "Bulk Up", "Low Kick",
        "Karate Chop", "Focus Energy", "Seismic Toss", "Revenge", "Vital Throw",
        "Knock Off", "Crunch", "Bullet Punch"
    },
    "Medicham": {
        "Rock Smash", "Zen Headbutt", "Ice Punch", "Protect", "Bide",
        "Confusion", "Meditate", "Force Palm", "High Jump Kick", "Reversal",
        "Psych Up", "Calm Mind"
    },
    "Heracross": {
        "Brick Break", "Pin Missile", "Rock Blast", "Aerial Ace", "Horn Attack",
        "Endure", "Chip Away", "Counter", "Megahorn", "Close Combat"
    },

    # Rank D Pokemon
    "Scolipede": {
        "Gunk Shot", "X-Scissor", "Earthquake", "Protect", "Poison Sting",
        "Rollout", "Poison Tail", "Venoshock", "Agility", "Steamroller",
        "Poison Jab", "Fire Fang", "Leech Life", "Toxic"
    },
    "Roserade": {
        "Giga Drain", "Sludge Bomb", "Shadow Ball", "Synthesis", "Absorb",
        "Growth", "Poison Sting", "Mega Drain", "Magical Leaf", "Sweet Scent",
        "Petal Dance", "Toxic Spikes"
    },
    "Gyarados": {
        "Waterfall", "Bounce", "Dragon Rush", "Crunch", "Thrash", "Bite",
        "Leer", "Twister", "Ice Fang", "Aqua Tail", "Dragon Dance", "Hydro Pump",
        "Hyper Beam"
    },
    "Scrafty": {
        "Brick Break", "Crunch", "Head Smash", "Scary Face", "Leer",
        "Low Kick", "Sand Attack", "Feint Attack", "Swagger", "Chip Away",
        "High Jump Kick", "Payback"
    },

    # Rank C Pokemon
    "Altaria": {
        "Moonblast", "Air Slash", "Mystical Fire", "Protect", "Peck", "Growl",
        "Astonish", "Sing", "Fury Attack", "Safeguard", "Mist", "Round",
        "Natural Gift", "Take Down", "Dragon Breath", "Dragon Pulse", "Perish Song",
        "Cotton Guard", "Dragon Dance", "Refresh"
    },
    "Gardevoir": {
        "Moonblast", "Psychic", "Mystical Fire", "Calm Mind", "Confusion",
        "Double Team", "Teleport", "Disarming Voice", "Wish", "Magical Leaf",
        "Heal Pulse", "Draining Kiss", "Imprison", "Future Sight", "Hypnosis",
        "Dream Eater", "Stored Power"
    },
    "Aurorus": {
        "Freeze-Dry", "Blizzard", "Rock Blast", "Protect", "Powder Snow",
        "Growl", "Thunder Wave", "Rock Throw", "Icy Wind", "Take Down",
        "Mist", "Aurora Beam", "Ancient Power", "Round", "Avalanche",
        "Hail", "Nature Power", "Encore", "Light Screen", "Ice Beam",
        "Hyper Beam"
    },
    "Mawile": {
        "Play Rough", "Iron Head", "Crunch", "Fire Fang", "Astonish",
        "Fake Tears", "Bite", "Sweet Scent", "Vice Grip", "Feint Attack",
        "Baton Pass", "Spit Up", "Stockpile", "Swallow", "Iron Defense",
        "Sucker Punch", "Swords Dance", "Thunder Fang", "Ice Fang"
    },
    "Clefable": {
        "Moonblast", "Stone Edge", "Flash Cannon", "Stealth Rock", "Pound",
        "Growl", "Encore", "Sing", "Double Slap", "Defense Curl", "Follow Me",
        "Bestow", "Wake-Up Slap", "Minimize", "Stored Power", "Metronome",
        "Cosmic Power", "Lucky Chant", "Body Slam", "Moonlight", "Meteor Mash",
        "Healing Wish", "After You", "Light Screen"
    },

    # Rank B Pokemon
    "Charizard": {
        "Flare Blitz", "Dragon Rush", "Air Slash", "Protect", "Scratch", "Growl",
        "Ember", "Smokescreen", "Dragon Breath", "Slash", "Flamethrower",
        "Fire Spin", "Inferno", "Heat Wave", "Fire Fang", "Flame Burst",
        "Wing Attack", "Shadow Claw"
    },
    "Garchomp": {
        "Draco Meteor", "Aerial Ace", "Earthquake", "Fire Fang", "Tackle",
        "Sand Attack", "Dragon Rage", "Sandstorm", "Take Down", "Dig",
        "Dragon Claw", "Crunch", "Dragon Rush"
    },
    "Tyranitar": {
        "Stone Edge", "Crunch", "Earthquake", "Ice Punch", "Bite", "Leer",
        "Sandstorm", "Screech", "Chip Away", "Rock Throw", "Scary Face",
        "Thrash", "Dark Pulse", "Payback", "Rock Slide", "Iron Defense",
        "Hyper Beam", "Giga Impact"
    },
    "Houndoom": {
        "Overheat", "Hyper Voice", "Earth Power", "Snarl", "Leer", "Ember",
        "Howl", "Smog", "Roar", "Bite", "Odor Sleuth", "Beat Up", "Fire Fang",
        "Feint Attack", "Embargo", "Foul Play", "Flamethrower", "Crunch",
        "Nasty Plot", "Inferno"
    },
    "Malamar": {
        "Psyshock", "Night Slash", "Liquidation", "Hypnosis", "Tackle",
        "Peck", "Constrict", "Reflect", "Foul Play", "Swagger", "Slash",
        "Psybeam", "Topsy-Turvy", "Pluck", "Psycho Cut", "Reversal",
        "Superpower"
    },
    "Scizor": {
        "Brick Break", "Crunch", "Bullet Punch", "Protect", "Quick Attack",
        "Leer", "Focus Energy", "Pursuit", "False Swipe", "Agility",
        "Metal Claw", "Fury Cutter", "Slash", "Razor Wind", "Iron Defense",
        "X-Scissor", "Night Slash", "Double Hit", "Iron Head", "Swords Dance",
        "Feint"
    },

    # Additional commonly seen Pokemon
    "Dragonair": {
        "Dragon Rage", "Twister", "Dragon Tail", "Agility", "Slam", "Aqua Tail",
        "Dragon Rush", "Safeguard", "Dragon Dance", "Outrage", "Hyper Beam",
        "Thunder Wave", "Wrap", "Leer"
    },
    "Dratini": {
        "Wrap", "Leer", "Thunder Wave", "Twister", "Dragon Rage", "Slam",
        "Agility", "Dragon Tail", "Aqua Tail", "Dragon Rush", "Dragon Dance"
    },
    "Eevee": {
        "Tackle", "Tail Whip", "Quick Attack", "Sand Attack", "Baby-Doll Eyes",
        "Swift", "Bite", "Refresh", "Take Down", "Charm", "Double Edge",
        "Last Resort", "Trump Card"
    },
    "Riolu": {
        "Quick Attack", "Endure", "Force Palm", "Feint", "Reversal",
        "Copycat", "Screech", "Bullet Punch", "Final Gambit", "Foresight",
        "Counter", "Nasty Plot"
    },
    "Floette": {
        "Vine Whip", "Fairy Wind", "Lucky Chant", "Razor Leaf", "Wish",
        "Magical Leaf", "Grassy Terrain", "Petal Blizzard", "Aromatherapy",
        "Misty Terrain", "Moonblast", "Petal Dance", "Solar Beam"
    },
    "Clefairy": {
        "Pound", "Growl", "Encore", "Sing", "Double Slap", "Defense Curl",
        "Follow Me", "Bestow", "Wake-Up Slap", "Minimize", "Stored Power",
        "Metronome", "Cosmic Power", "Lucky Chant", "Body Slam", "Moonlight",
        "Meteor Mash", "Healing Wish", "After You"
    },
    "Panpour": {
        "Scratch", "Play Nice", "Lick", "Leer", "Water Gun", "Fury Swipes",
        "Bite", "Scald", "Taunt", "Fling", "Acrobatics", "Brine", "Crunch"
    },
    "Pansage": {
        "Scratch", "Play Nice", "Lick", "Leer", "Vine Whip", "Fury Swipes",
        "Bite", "Seed Bomb", "Taunt", "Fling", "Acrobatics", "Grass Knot", "Crunch"
    },
    "Arbok": {
        "Wrap", "Leer", "Poison Sting", "Bite", "Glare", "Acid", "Stockpile",
        "Swallow", "Spit Up", "Acid Spray", "Mud Bomb", "Gastro Acid",
        "Belch", "Haze", "Crunch", "Coil", "Gunk Shot"
    },
    "Ekans": {
        "Wrap", "Leer", "Poison Sting", "Bite", "Glare", "Screech",
        "Acid", "Stockpile", "Swallow", "Spit Up", "Acid Spray", "Mud Bomb"
    },
    "Espurr": {
        "Scratch", "Leer", "Covet", "Confusion", "Psybeam", "Fake Out",
        "Disarming Voice", "Light Screen", "Psychic", "Charm", "Role Play",
        "Sucker Punch"
    },
    "Staryu": {
        "Tackle", "Harden", "Water Gun", "Rapid Spin", "Recover", "Psywave",
        "Swift", "Bubble Beam", "Camouflage", "Gyro Ball", "Brine",
        "Minimize", "Light Screen", "Power Gem", "Cosmic Power", "Hydro Pump"
    },
    "Beedrill": {
        "Poison Sting", "String Shot", "Harden", "Fury Attack", "Focus Energy",
        "Twineedle", "Rage", "Pursuit", "Toxic Spikes", "Pin Missile",
        "Agility", "Poison Jab", "Endeavor", "Fell Stinger"
    },
    "Fennekin": {
        "Scratch", "Tail Whip", "Ember", "Howl", "Flame Charge", "Psybeam",
        "Fire Spin", "Lucky Chant", "Light Screen", "Psyshock", "Flamethrower",
        "Will-O-Wisp", "Psychic", "Sunny Day", "Magic Room", "Fire Blast"
    },
    "Chespin": {
        "Tackle", "Growl", "Vine Whip", "Rollout", "Bite", "Leech Seed",
        "Pin Missile", "Take Down", "Seed Bomb", "Mud Shot", "Bulk Up",
        "Body Slam", "Pain Split", "Wood Hammer"
    },
    "Gastly": {
        "Hypnosis", "Lick", "Spite", "Mean Look", "Curse", "Night Shade",
        "Confuse Ray", "Sucker Punch", "Shadow Ball", "Dream Eater",
        "Dark Pulse", "Destiny Bond", "Hex", "Nightmare"
    },
    "Meditite": {
        "Bide", "Meditate", "Confusion", "Detect", "Hidden Power", "Mind Reader",
        "Feint", "Force Palm", "High Jump Kick", "Psych Up", "Acupressure",
        "Power Trick", "Reversal", "Recover", "Counter"
    },
    "Patrat": {
        "Tackle", "Leer", "Bite", "Low Kick", "Bide", "Detect", "Sand Attack",
        "Crunch", "Hypnosis", "Super Fang", "After You", "Work Up", "Hyper Fang",
        "Mean Look", "Baton Pass", "Slam"
    },
    "Audino": {
        "Pound", "Growl", "Helping Hand", "Refresh", "Double Slap", "Attract",
        "Secret Power", "Entrainment", "Take Down", "Heal Pulse", "After You",
        "Simple Beam", "Double Edge", "Last Resort"
    },
    "Froakie": {
        "Pound", "Growl", "Bubble", "Quick Attack", "Lick", "Water Pulse",
        "Smokescreen", "Round", "Fling", "Smack Down", "Substitute",
        "Bounce", "Double Team", "Hydro Pump"
    },
    "Flaaffy": {
        "Tackle", "Growl", "Thunder Shock", "Thunder Wave", "Cotton Spore",
        "Charge", "Take Down", "Electro Ball", "Confuse Ray", "Power Gem",
        "Discharge", "Cotton Guard", "Signal Beam", "Light Screen", "Thunder"
    },
    "Gible": {
        "Tackle", "Sand Attack", "Dragon Rage", "Sandstorm", "Take Down",
        "Sand Tomb", "Slash", "Dragon Claw", "Dig", "Dragon Rush"
    },
    "Swablu": {
        "Peck", "Growl", "Astonish", "Sing", "Fury Attack", "Safeguard",
        "Mist", "Round", "Natural Gift", "Take Down", "Refresh",
        "Mirror Move", "Cotton Guard", "Dragon Pulse", "Perish Song", "Moonblast"
    },
    "Goomy": {
        "Tackle", "Bubble", "Absorb", "Protect", "Bide", "Dragon Breath",
        "Rain Dance", "Flail", "Body Slam", "Muddy Water", "Dragon Pulse"
    },
    "Binacle": {
        "Scratch", "Sand Attack", "Water Gun", "Withdraw", "Fury Swipes",
        "Slash", "Mud-Slap", "Clamp", "Rock Polish", "Ancient Power",
        "Hone Claws", "Fury Cutter", "Night Slash", "Razor Shell", "Cross Chop"
    },
    "Vanillite": {
        "Icicle Spear", "Harden", "Astonish", "Uproar", "Icy Wind", "Mist",
        "Avalanche", "Taunt", "Mirror Shot", "Acid Armor", "Ice Beam",
        "Hail", "Mirror Coat", "Blizzard", "Sheer Cold"
    },
    "Scraggy": {
        "Leer", "Low Kick", "Sand Attack", "Feint Attack", "Headbutt",
        "Swagger", "Brick Break", "Payback", "Chip Away", "High Jump Kick",
        "Scary Face", "Crunch", "Facade", "Rock Climb", "Focus Punch", "Head Smash"
    },
    "Numel": {
        "Growl", "Tackle", "Ember", "Magnitude", "Focus Energy", "Flame Burst",
        "Take Down", "Amnesia", "Lava Plume", "Earth Power", "Curse",
        "Yawn", "Earthquake", "Flamethrower", "Double-Edge"
    },
    "Drilbur": {
        "Scratch", "Mud Sport", "Rapid Spin", "Mud-Slap", "Fury Swipes",
        "Metal Claw", "Dig", "Hone Claws", "Slash", "Rock Slide", "Earthquake",
        "Swords Dance", "Sandstorm", "Drill Run", "Fissure"
    },
    "Budew": {
        "Absorb", "Growth", "Water Sport", "Stun Spore", "Mega Drain",
        "Worry Seed", "Poison Sting"
    },
    "Shuppet": {
        "Knock Off", "Screech", "Night Shade", "Spite", "Will-O-Wisp",
        "Shadow Sneak", "Curse", "Feint Attack", "Hex", "Shadow Ball",
        "Sucker Punch", "Embargo", "Snatch", "Grudge", "Trick"
    },
    "Carbink": {
        "Tackle", "Harden", "Rock Throw", "Sharpen", "Smack Down", "Reflect",
        "Stealth Rock", "Guard Split", "Ancient Power", "Flail", "Skill Swap",
        "Power Gem", "Stone Edge", "Moonblast", "Light Screen", "Safeguard"
    },
    "Electrike": {
        "Tackle", "Thunder Wave", "Leer", "Howl", "Quick Attack", "Spark",
        "Odor Sleuth", "Thunder Fang", "Bite", "Discharge", "Roar",
        "Wild Charge", "Charge", "Thunder"
    },
    "Manectric": {
        "Fire Fang", "Thunder Fang", "Bite", "Discharge", "Tackle", "Thunder Wave",
        "Leer", "Howl", "Quick Attack", "Spark", "Odor Sleuth", "Roar",
        "Wild Charge", "Charge", "Thunder", "Electric Terrain"
    },
    "Sliggoo": {
        "Tackle", "Bubble", "Absorb", "Protect", "Bide", "Dragon Breath",
        "Rain Dance", "Flail", "Body Slam", "Muddy Water", "Dragon Pulse",
        "Water Pulse", "Curse"
    },
    "Lairon": {
        "Tackle", "Harden", "Mud-Slap", "Headbutt", "Metal Claw", "Iron Defense",
        "Roar", "Take Down", "Iron Head", "Protect", "Metal Sound",
        "Iron Tail", "Autotomize", "Heavy Slam", "Double-Edge", "Metal Burst"
    },
    "Skrelp": {
        "Tackle", "Smokescreen", "Water Gun", "Feint Attack", "Tail Whip",
        "Bubble", "Acid", "Camouflage", "Poison Tail", "Water Pulse",
        "Double Team", "Toxic", "Aqua Tail", "Sludge Bomb", "Hydro Pump",
        "Dragon Pulse"
    },
    "Barbaracle": {
        "Stone Edge", "Razor Shell", "Cross Chop", "Slash", "Scratch",
        "Sand Attack", "Water Gun", "Withdraw", "Fury Swipes", "Mud-Slap",
        "Clamp", "Rock Polish", "Ancient Power", "Hone Claws", "Fury Cutter",
        "Night Slash", "Shell Smash"
    },
    "Stunfisk": {
        "Mud-Slap", "Mud Sport", "Bide", "Thunder Shock", "Mud Shot",
        "Camouflage", "Mud Bomb", "Discharge", "Endure", "Flail", "Bounce",
        "Muddy Water", "Thunderbolt", "Revenge", "Fissure"
    },
    "Vanillish": {
        "Icicle Spear", "Harden", "Astonish", "Uproar", "Icy Wind", "Mist",
        "Avalanche", "Taunt", "Mirror Shot", "Acid Armor", "Ice Beam",
        "Hail", "Mirror Coat", "Blizzard", "Sheer Cold", "Harden"
    },
    "Garbodor": {
        "Pound", "Poison Gas", "Recycle", "Toxic Spikes", "Acid Spray",
        "Double Slap", "Sludge", "Stockpile", "Swallow", "Take Down",
        "Sludge Bomb", "Clear Smog", "Toxic", "Amnesia", "Belch",
        "Gunk Shot", "Explosion"
    },
    "Noibat": {
        "Tackle", "Absorb", "Gust", "Supersonic", "Double Team", "Wing Attack",
        "Bite", "Air Cutter", "Whirlwind", "Super Fang", "Air Slash",
        "Hurricane", "Tailwind", "Boomburst", "Dragon Pulse"
    },
    "Gabite": {
        "Tackle", "Sand Attack", "Dragon Rage", "Sandstorm", "Take Down",
        "Sand Tomb", "Slash", "Dragon Claw", "Dig", "Dragon Rush",
        "Dual Chop"
    },
    "Raichu": {
        "Thunderbolt", "Thunder Shock", "Growl", "Thunder Wave", "Quick Attack",
        "Electro Ball", "Double Team", "Spark", "Nuzzle", "Discharge",
        "Slam", "Thunderbolt", "Feint", "Agility", "Wild Charge", "Thunder"
    },
    "Camerupt": {
        "Eruption", "Fissure", "Rock Slide", "Growl", "Tackle", "Ember",
        "Magnitude", "Focus Energy", "Flame Burst", "Take Down", "Amnesia",
        "Lava Plume", "Earth Power", "Curse", "Earthquake", "Fissure"
    },
    "Pumpkaboo": {
        "Trick", "Astonish", "Confuse Ray", "Scary Face", "Trick-or-Treat",
        "Worry Seed", "Razor Leaf", "Leech Seed", "Bullet Seed", "Shadow Sneak",
        "Shadow Ball", "Pain Split", "Seed Bomb"
    },
    "Phantump": {
        "Tackle", "Confuse Ray", "Astonish", "Growth", "Ingrain", "Feint Attack",
        "Leech Seed", "Curse", "Will-O-Wisp", "Forest's Curse", "Destiny Bond",
        "Shadow Claw", "Wood Hammer", "Horn Leech", "Phantom Force"
    },
    "Klefki": {
        "Fairy Lock", "Tackle", "Fairy Wind", "Astonish", "Metal Sound",
        "Spikes", "Draining Kiss", "Crafty Shield", "Foul Play", "Torment",
        "Mirror Shot", "Imprison", "Recycle", "Play Rough", "Magic Room",
        "Heal Block"
    },
    "Hippowdon": {
        "Ice Fang", "Fire Fang", "Thunder Fang", "Bite", "Sand Attack",
        "Crunch", "Yawn", "Take Down", "Sand Tomb", "Dig", "Sandstorm",
        "Earthquake", "Double-Edge", "Fissure"
    },
    "Emolga": {
        "Thunder Shock", "Quick Attack", "Tail Whip", "Charge", "Spark",
        "Nuzzle", "Pursuit", "Double Team", "Shock Wave", "Electro Ball",
        "Acrobatics", "Light Screen", "Encore", "Volt Switch", "Agility",
        "Discharge"
    },
    "Banette": {
        "Knock Off", "Screech", "Night Shade", "Spite", "Will-O-Wisp",
        "Shadow Sneak", "Curse", "Feint Attack", "Hex", "Shadow Ball",
        "Sucker Punch", "Embargo", "Snatch", "Grudge", "Trick", "Phantom Force"
    },
    "Haunter": {
        "Hypnosis", "Lick", "Spite", "Mean Look", "Curse", "Night Shade",
        "Confuse Ray", "Sucker Punch", "Shadow Punch", "Shadow Ball",
        "Dream Eater", "Dark Pulse", "Destiny Bond", "Hex", "Nightmare"
    },
    "Heliolisk": {
        "Discharge", "Parabolic Charge", "Thunder Wave", "Charge", "Pound",
        "Tail Whip", "Thunder Shock", "Quick Attack", "Razor Wind", "Spark",
        "Electrify", "Thunderbolt", "Volt Switch", "Thunder"
    },
    "Eelektross": {
        "Thrash", "Discharge", "Crunch", "Zap Cannon", "Crush Claw",
        "Headbutt", "Acid", "Bind", "Spark", "Thunder Wave", "Charge Beam",
        "Coil", "Wild Charge", "Gastro Acid", "Thunderbolt"
    },
    "Frogadier": {
        "Pound", "Growl", "Bubble", "Quick Attack", "Lick", "Water Pulse",
        "Smokescreen", "Round", "Fling", "Smack Down", "Substitute",
        "Bounce", "Double Team", "Hydro Pump"
    },
    "Quilladin": {
        "Tackle", "Growl", "Vine Whip", "Rollout", "Bite", "Leech Seed",
        "Pin Missile", "Needle Arm", "Take Down", "Seed Bomb", "Mud Shot",
        "Bulk Up", "Body Slam", "Pain Split", "Wood Hammer"
    },
    "Tynamo": {
        "Tackle", "Thunder Wave", "Spark", "Charge Beam"
    },
    "Clauncher": {
        "Splash", "Water Gun", "Water Sport", "Vice Grip", "Bubble",
        "Flail", "Bubble Beam", "Swords Dance", "Crabhammer", "Water Pulse",
        "Smack Down", "Aqua Jet", "Muddy Water"
    },
    "Bergmite": {
        "Tackle", "Bite", "Harden", "Powder Snow", "Icy Wind", "Take Down",
        "Sharpen", "Curse", "Ice Fang", "Ice Ball", "Rapid Spin",
        "Avalanche", "Blizzard", "Recover", "Double-Edge", "Crunch"
    },
    "Snover": {
        "Powder Snow", "Leer", "Razor Leaf", "Icy Wind", "Grass Whistle",
        "Swagger", "Mist", "Ice Shard", "Ingrain", "Wood Hammer",
        "Blizzard", "Sheer Cold"
    },
    "Meowstic": {
        "Stored Power", "Psybeam", "Charm", "Disarming Voice", "Scratch",
        "Leer", "Covet", "Confusion", "Light Screen", "Psyshock",
        "Fake Out", "Psychic", "Role Play", "Imprison", "Sucker Punch",
        "Misty Terrain", "Quick Guard", "Future Sight"
    },
    "Pinsir": {
        "Vice Grip", "Focus Energy", "Bind", "Seismic Toss", "Harden",
        "Revenge", "Brick Break", "Vital Throw", "X-Scissor", "Thrash",
        "Swords Dance", "Submission", "Guillotine", "Superpower"
    },
    "Scyther": {
        "Vacuum Wave", "Quick Attack", "Leer", "Focus Energy", "Pursuit",
        "False Swipe", "Agility", "Wing Attack", "Fury Cutter", "Slash",
        "Razor Wind", "Double Team", "X-Scissor", "Night Slash", "Double Hit",
        "Air Slash", "Swords Dance", "Feint"
    },
    "Snorunt": {
        "Powder Snow", "Leer", "Double Team", "Ice Shard", "Icy Wind",
        "Bite", "Ice Fang", "Headbutt", "Protect", "Frost Breath",
        "Crunch", "Blizzard", "Hail"
    },
    "Charmeleon": {
        "Scratch", "Growl", "Ember", "Smokescreen", "Dragon Rage",
        "Scary Face", "Fire Fang", "Flame Burst", "Slash", "Flamethrower",
        "Fire Spin", "Inferno"
    },
    "Inkay": {
        "Tackle", "Peck", "Constrict", "Reflect", "Foul Play", "Swagger",
        "Psybeam", "Hypnosis", "Slash", "Night Slash", "Psycho Cut",
        "Acrobatics", "Superpower"
    },
    "Wartortle": {
        "Tackle", "Tail Whip", "Water Gun", "Withdraw", "Bubble", "Bite",
        "Rapid Spin", "Protect", "Water Pulse", "Aqua Tail", "Skull Bash",
        "Iron Defense", "Rain Dance", "Hydro Pump"
    },
    "Alakazam": {
        "Teleport", "Confusion", "Disable", "Psybeam", "Miracle Eye",
        "Reflect", "Psycho Cut", "Recover", "Telekinesis", "Ally Switch",
        "Psych Up", "Calm Mind", "Psychic", "Future Sight", "Role Play",
        "Trick"
    },
    "Litwick": {
        "Ember", "Astonish", "Minimize", "Smog", "Fire Spin", "Confuse Ray",
        "Night Shade", "Will-O-Wisp", "Flame Burst", "Imprison", "Hex",
        "Memento", "Inferno", "Curse", "Shadow Ball", "Pain Split", "Overheat"
    },
    "Machamp": {
        "Low Kick", "Leer", "Focus Energy", "Karate Chop", "Foresight",
        "Seismic Toss", "Revenge", "Vital Throw", "Wake-Up Slap", "Knock Off",
        "Cross Chop", "Scary Face", "DynamicPunch", "Strength",
        "Submission", "Bulk Up", "Focus Punch", "Superpower"
    },
    "Litleo": {
        "Tackle", "Leer", "Ember", "Work Up", "Headbutt", "Noble Roar",
        "Take Down", "Fire Fang", "Endeavor", "Echoed Voice", "Flamethrower",
        "Crunch", "Hyper Voice", "Incinerate", "Overheat"
    },
    "Pancham": {
        "Tackle", "Leer", "Arm Thrust", "Work Up", "Karate Chop", "Comet Punch",
        "Slash", "Circle Throw", "Vital Throw", "Body Slam", "Crunch",
        "Entrainment", "Parting Shot", "Sky Uppercut"
    },
    "Fletchinder": {
        "Ember", "Growl", "Peck", "Quick Attack", "Agility", "Flail",
        "Razor Wind", "Natural Gift", "Flame Charge", "Acrobatics", "Me First",
        "Tailwind", "Steel Wing"
    },
    "Skiddo": {
        "Tackle", "Growth", "Vine Whip", "Tail Whip", "Leech Seed",
        "Razor Leaf", "Worry Seed", "Synthesis", "Take Down", "Bulldoze",
        "Seed Bomb", "Bulk Up", "Double-Edge", "Horn Leech", "Leaf Blade",
        "Milk Drink"
    },
    "Bayleef": {
        "Tackle", "Growl", "Razor Leaf", "Poison Powder", "Synthesis",
        "Reflect", "Magical Leaf", "Natural Gift", "Sweet Scent", "Light Screen",
        "Body Slam", "Safeguard", "Aromatherapy", "Solar Beam"
    },
    "Croconaw": {
        "Scratch", "Leer", "Water Gun", "Rage", "Bite", "Scary Face",
        "Ice Fang", "Flail", "Crunch", "Chip Away", "Slash", "Screech",
        "Thrash", "Aqua Tail", "Superpower", "Hydro Pump"
    },
    "Pignite": {
        "Tackle", "Tail Whip", "Ember", "Odor Sleuth", "Defense Curl",
        "Flame Charge", "Arm Thrust", "Smog", "Rollout", "Take Down",
        "Heat Crash", "Assurance", "Flamethrower", "Head Smash", "Roar",
        "Flare Blitz"
    },
    "Excadrill": {
        "Rapid Spin", "Mud-Slap", "Fury Swipes", "Metal Claw", "Dig",
        "Hone Claws", "Slash", "Rock Slide", "Horn Drill", "Earthquake",
        "Swords Dance", "Sandstorm", "Drill Run", "Fissure"
    },
    "Skarmory": {
        "Leer", "Peck", "Sand Attack", "Metal Claw", "Air Cutter",
        "Fury Attack", "Feint", "Swift", "Spikes", "Agility", "Steel Wing",
        "Autotomize", "Air Slash", "Slash", "Metal Sound", "Night Slash",
        "Sky Attack"
    },
    "Dragalge": {
        "Dragon Tail", "Twister", "Toxic Spikes", "Water Gun", "Smokescreen",
        "Double Team", "Toxic", "Aqua Tail", "Sludge Bomb", "Hydro Pump",
        "Dragon Pulse", "Tackle", "Feint Attack", "Tail Whip", "Bubble",
        "Acid", "Camouflage", "Poison Tail", "Water Pulse"
    },
}


def normalize_move(move: str) -> str:
    """Normalize move name for comparison (lowercase, no special chars)."""
    return move.lower().strip().replace("-", "").replace(" ", "")


def calculate_move_matches(pokemon_moves: List[str], species_movesets: Set[str]) -> int:
    """Calculate how many moves match between Pokemon and species moveset."""
    normalized_pokemon_moves = {normalize_move(m) for m in pokemon_moves}
    normalized_species_moves = {normalize_move(m) for m in species_movesets}
    return len(normalized_pokemon_moves & normalized_species_moves)


def find_species_by_moves(
    pokemon_moves: List[str],
    min_matches: int = 2
) -> List[Tuple[str, int]]:
    """
    Find potential Pokemon species by matching moves.
    Returns list of (species, match_count) sorted by match count (descending).
    """
    if not pokemon_moves:
        return []

    matches = []
    for species, moveset in POKEMON_MOVESETS.items():
        match_count = calculate_move_matches(pokemon_moves, moveset)
        if match_count >= min_matches:
            matches.append((species, match_count))

    # Sort by match count (descending), then alphabetically
    matches.sort(key=lambda x: (-x[1], x[0]))
    return matches


def fix_trainers_json(file_path: Path) -> Dict[str, int]:
    """
    Fix missing species fields in trainers.json.
    Returns statistics about what was fixed.
    """
    # Read the JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
        trainers = json.load(f)

    stats = {
        "total_pokemon": 0,
        "already_had_species": 0,
        "fixed": 0,
        "unknown": 0,
        "no_moves": 0
    }

    unknown_pokemon = []

    # Process each trainer and their party
    for trainer in trainers:
        for pokemon in trainer.get("party", []):
            stats["total_pokemon"] += 1

            # Skip if species already exists
            if pokemon.get("species"):
                stats["already_had_species"] += 1
                continue

            # Get the known moves
            known_moves = pokemon.get("knownMoves", [])

            if not known_moves:
                stats["no_moves"] += 1
                unknown_pokemon.append({
                    "trainer": trainer["name"],
                    "level": pokemon.get("level"),
                    "moves": known_moves,
                    "reason": "No moves to match"
                })
                continue

            # Try to find matching species
            matches = find_species_by_moves(known_moves, min_matches=2)

            if matches:
                # Use the best match (highest move count)
                best_match = matches[0]
                species, match_count = best_match
                pokemon["species"] = species
                stats["fixed"] += 1
                print(f"✓ Fixed: {trainer['name']} - Level {pokemon.get('level')} → {species} ({match_count}/{len(known_moves)} moves matched)")
            else:
                stats["unknown"] += 1
                unknown_pokemon.append({
                    "trainer": trainer["name"],
                    "level": pokemon.get("level"),
                    "moves": known_moves,
                    "reason": "No matching species found"
                })
                print(f"✗ Unknown: {trainer['name']} - Level {pokemon.get('level')} - Moves: {', '.join(known_moves)}")

    # Save the updated JSON
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(trainers, f, indent=2, ensure_ascii=False)

    # Print summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Total Pokemon:           {stats['total_pokemon']}")
    print(f"Already had species:     {stats['already_had_species']}")
    print(f"Fixed (species added):   {stats['fixed']}")
    print(f"Unknown (no matches):    {stats['unknown']}")
    print(f"No moves to match:       {stats['no_moves']}")
    print("="*70)

    if unknown_pokemon:
        print("\nUNKNOWN POKEMON DETAILS:")
        print("-"*70)
        for unk in unknown_pokemon:
            print(f"Trainer: {unk['trainer']} | Level: {unk['level']}")
            print(f"  Reason: {unk['reason']}")
            if unk['moves']:
                print(f"  Moves: {', '.join(unk['moves'])}")
            print()

    return stats


def main():
    """Main entry point for the script."""
    trainers_file = Path("/home/user/pokemon-type-chart/public/data/trainers.json")

    if not trainers_file.exists():
        print(f"Error: File not found: {trainers_file}")
        return 1

    print("Pokemon Legends Z-A Trainer Data Fixer")
    print("="*70)
    print(f"Processing: {trainers_file}")
    print(f"Species database: {len(POKEMON_MOVESETS)} Pokemon")
    print("="*70)
    print()

    try:
        stats = fix_trainers_json(trainers_file)
        print("\n✓ Successfully updated trainers.json")
        return 0
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())
