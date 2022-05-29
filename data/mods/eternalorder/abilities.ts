export const Abilities: {[k: string]: ModdedAbilityData} = {
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
		onModifyDefPriority: 10,
		onModifyDef(def){
			if(this.field.isWeather('sandstorm')){
				return this.modify(def, 1.5);
			}
		},
	},
	snowcloak:{
		inherit:true,
		shortDesc: "Raises Special Defense of this Pokemon during Hail.",
		rating: 2,
		onModifySpDPriority: 10,
		onModifySpD(spd){
			if(this.field.isWeather('hail')){
				return this.modify(spd, 1.5);
			}
		},
	},
	tangledfeet:{
		inherit:true,
		shortDesc: "Increases speed of this Pokemon while confused.",
		rating: 1,
		onModifySpePriority: 5,
		onModifySpe(speed, target) {
			if (typeof speed !== 'number') return;
			if (target?.volatiles['confusion']) {
				this.debug('Tangled Feet - increasing  speed');
				return this.chainModify(1.5);
			}
		},
	},
}