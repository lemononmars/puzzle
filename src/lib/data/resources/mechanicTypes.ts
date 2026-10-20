export interface TechnicalTerm {
	en: string;
	ja: string;
	th: string;
}

export interface MechanicPuzzle {
	title: string;
	prompt: string;
	svg: string;
	solutionSvg: string;
	hint: string;
	acceptedAnswers: string[];
	answerDisplay: string;
	solutionExplanation: string;
}

export interface MechanicDetail {
	id: string;
	englishTitle: string;
	thaiTitle: string;
	japaneseTitle: string;
	description: string;
	chapter: {
		id: string;
		hasExercise?: boolean;
		englishTitle: string;
		thaiTitle: string;
		japaneseTitle: string;
		accent: string;
	};
	detailedDescription: string;
	solvingTechnique: string;
	technicalTerms: TechnicalTerm[];
	puzzle: MechanicPuzzle;
	hasExercise?: boolean;
}

