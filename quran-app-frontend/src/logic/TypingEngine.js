
const pending = 0;
const correct = 1;
const wrong = 2;


const segmenter = new Intl.Segmenter("ar", {granularity: "grapheme",});




function splitIntoGraphemes(verse) {
    return Array.from(segmenter.segment(verse), character => character.segment);
}

class TypingEngine {

constructor (verse) {

    this.targetVerse = splitIntoGraphemes(verse);
    this.status = new Array(this.targetVerse.length).fill(pending);
    this.cursorIndex = 0;
    this.finished = this.targetVerse.length === 0;

    }

    typingCheck(graphemeInput){

        if (this.finished) return;

        const expectedGrapheme = this.targetVerse[this.cursorIndex];

        if (graphemeInput === expectedGrapheme){

            this.status[this.cursorIndex] = correct;
            this.cursorIndex++;
        }
        
        else{
            this.status[this.cursorIndex] = wrong;
        }

        if(this.targetVerse === this.cursorIndex.length){
            this.finished = true;
        }

    }
}
