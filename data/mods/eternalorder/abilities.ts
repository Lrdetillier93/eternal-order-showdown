export const Abilities: {[k: string]: ModdedAbilityData} = {
	battlearmor:{
		inherit: true,
		shortDesc: "This Pokemon cannot be crit, and its Defense is increased by 1.2x.",
		rating: 2,
		onModifyDefPriority: 5,
		onModifyDef(def){
			return this.chainModify(1.2)
		}
	},
	colorchange:{
		inherit: true,
		shortDesc: "This Pokemon's type changes to the type of a move it's hit by before the move hits, unless it has the type.",
		rating: 1,
		onAfterMoveSecondary(target, source, move){
			return
		},
		onSourcePrepareHit(source, target, move) {
			if (!target.hp) return;
			const type = move.type;
			if (
				target.isActive && move.effectType === 'Move' && move.category !== 'Status' &&
				type !== '???' && !target.hasType(type)
			) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const action = this.queue.willMove(target);
					if (action && action.move.id === 'curse') {
						action.targetLoc = -1;
					}
				}
			}
		},
	},
	corrosion:{
		inherit: true,
		shortDesc: "This pokemon can poison the target regardless of typing, and its Poison-type moves are super-effective against Steel types.",
		rating: 2.5,
		onSourceModifyDamage(dmg, attacker, defender, move){
			if(defender.hasType("Steel") && move.type === "Poison"){
				//Something goes here. No idea what.
			}
		}
	},
	dauntlessshield:{
		inherit: true,
		shortDesc: "Raises both defenses by one stage on switch in.",
		rating: 3.5,
		onStart(pokemon) {
			this.boost({def: 1, spd: 1}, pokemon);
		},
	},
	defeatist:{
		inherit: true,
		shortDesc: "Lowers Attacking stats when this Pokemon is below 1/3 HP.",
		rating: -1,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				return this.chainModify(0.5);
			}
		},
	},
	flamebody:{
		inherit: true,
		shortDesc: '30% chance a Pokemon making contact with this Pokemon will be burned, and burn chance is doubled on moves that can burn.',
		rating: 3,
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance of burn');
				for (const secondary of move.secondaries) {
					if (secondary.chance && secondary.status === 'brn') secondary.chance *= 2;
				}
			}
		},
	},
	flareboost:{
		inherit:true,
		shortDesc: "Raises Special Attack and Speed by 1.5x when poisoned.",
		rating: 3,
		onBasePower(basePower){
			return this.chainModify(1);
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, attacker){
			if ((attacker.status === 'brn')) {
				return this.chainModify(1.5);
			}
		},
		onModifySpe(spe, attacker){
			if ((attacker.status === 'brn')) {
				return this.chainModify(1.5);
			}
		},
	},
	galewings:{
		inherit: true,
		shortDesc: "Gives Flying-type moves priority if this Pokemon is over 50% health.",
		rating: 4,
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Flying' && pokemon.hp >= pokemon.maxhp / 2) return priority + 1;
		},
	},
	heavymetal:{
		inherit:true,
		shortDesc: "This Pokemon's weight is increased, and it takes less damage from Fighting-type moves.",
		rating: 1,
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fighting') {
				this.debug('Heavy Metal weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fighting') {
				this.debug('Heavy Metal weaken');
				return this.chainModify(0.5);
			}
		},
	},
	hustle:{
		inherit: true,
		shortDesc: "Raises Attack and lowers defenses of this Pokemon.",
		rating: 2,
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.modify(atk, 1.5);
		},
		onModifyDefPriority: 5,
		onModifyDef(def){
			return this.modify(def, 0.75)
		},
		onModifySpDPriority: 5,
		onModifySpD(spd){
			return this.modify(spd, 0.75)
		},
	},
	icebody:{
		inherit: true,
		rating: 1.5,
		onWeather(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.baseMaxhp / 8);
			}
		},
	},
	ironfist:{
		inherit: true,
		rating: 3,
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify(1.4);
			}
		},
	},
	keeneye:{
		inherit:true,
		shortDesc: "Raises this Pokemon's accuracy by 1.3x.",
		rating: 3,
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('keeneye- enhancing accuracy');
			return this.chainModify([5325, 4096]);
		},
	},
	leafguard:{
		inherit: true,
		shortDesc: "Prevents status conditions and boosts defenses by 1.5x in sunny weather.",
		rating: 1.5,
		onModifyDefPriority: 5,
		onModifyDef(def, pokemon){
			if(['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())){
				return this.chainModify(1.5)
			}
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon){
			if(['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())){
				return this.chainModify(1.5)
			}
		}
	},
	lightmetal:{
		inherit: true,
		shortDesc: "This Pokemon's weight is decreased, and it takes less damage from Ground-type moves.",
		rating: 1,
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ground') {
				this.debug('Light Metal weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ground') {
				this.debug('Light Metal weaken');
				return this.chainModify(0.5);
			}
		},
	},
	megalauncher:{
		inherit: true,
		shortDesc: "Increases the power of pulse and ball/bomb moves.",
		rating: 3,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bullet'] || move.flags['pulse']) {
				return this.chainModify(1.5);
			}
		},
	},
	normalize:{
		inherit: true,
		shortDesc: "All of this Pokemon's moves become Normal type, and their power is boosted in Clear Air.",
		rating: 1.5,
		onBasePower(basePower, pokemon, target, move) {
			if (move.normalizeBoosted) this.chainModify([4915, 4096]);
			else if(this.field.isWeather('clearair') && move.category !== 'Status'){
				this.debug("Normalize power boost in Clear Air.")
				this.chainModify(1.5)
			}
		},
	},
	raindish: {
		inherit: true,
		rating: 1.5,
		onWeather(target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.baseMaxhp / 8);
			}
		},
	},
	runaway:{
		inherit: true,
		shortDesc: "This Pokemon cannot be trapped.",
		rating: 2,
		onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) {
			pokemon.trapped = pokemon.maybeTrapped = false;
		},
	},
	sandveil:{
		inherit: true,
		shortDesc: "Raises Def of this Pokemon during Sandstorm.",
		rating: 2,
		onModifyAccuracy(accuracy){
			return this.chainModify(1)
		},
		onModifyDefPriority: 10,
		onModifyDef(def){
			if(this.field.isWeather('sandstorm')){
				return this.modify(def, 1.5);
			}
		},
	},
	shellarmor:{
		inherit: true,
		shortDesc: "This Pokemon cannot be crit, and its Special Defence is raised by 1.2x",
		rating: 2,
		onModifySpDPriority: 5,
		onModifySpD(spd){
			return this.chainModify(1.2)
		}
	},
	snowcloak:{
		inherit:true,
		shortDesc: "Raises Special Defense of this Pokemon during Hail.",
		rating: 2,
		onModifyAccuracy(accuracy){
			return this.chainModify(1)
		},
		onModifySpDPriority: 10,
		onModifySpD(spd){
			if(this.field.isWeather('hail')){
				return this.modify(spd, 1.5);
			}
		},
	},
	static:{
		inherit: true,
		shortDesc: '30% chance a Pokemon making contact with this Pokemon will be paralyzed, and paralysis chance is doubled on moves that can burn.',
		rating: 3,
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance of paralysis');
				for (const secondary of move.secondaries) {
					if (secondary.chance && secondary.status === 'par') secondary.chance *= 2;
				}
			}
		},
	},
	tangledfeet:{
		inherit:true,
		shortDesc: "Increases speed of this Pokemon while confused.",
		rating: 1,
		onModifySpe(speed, target) {
			if (typeof speed !== 'number') return;
			if (target?.volatiles['confusion']) {
				this.debug('Tangled Feet - increasing  speed');
				return this.chainModify(1.5);
			}
		},
	},
	toxicboost:{
		inherit:true,
		shortDesc: "Raises Attack and Speed by 1.5x when poisoned.",
		rating: 3,
		onBasePower(basePower){
			return this.chainModify(1);
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker){
			if ((attacker.status === 'psn' || attacker.status === 'tox')) {
				return this.chainModify(1.5);
			}
		},
		onModifySpe(spe, attacker){
			if ((attacker.status === 'psn' || attacker.status === 'tox')) {
				return this.chainModify(1.5);
			}
		},
	},
	truant: {
		inherit: true,
		shortDesc: "Lowers Attack and Speed of this Pokemon every other turn.",
		rating: -1,
		onBeforeMove(pokemon){
			return true;
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon){
			if(pokemon.removeVolatile('truant')){
				this.chainModify(0.5);
			}
		},
		onModifySpe(spe, pokemon){
			if(pokemon.removeVolatile('truant')){
				this.chainModify(0.5);
			}
			pokemon.addVolatile('truant')
		},
	},
	unnerve:{
		inherit: true,
		shortDesc: "While this Pokemon is active, prevents the opponent from using items."
		//Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
	},
	wonderguard:{
		inherit: true,
		shortDesc: "Only supereffective moves will hit, and this Pokemon will not take damage from weather/life orb/hazards.",
		rating: 5,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail') return false;
		},
	}
}