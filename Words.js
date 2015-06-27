var ones_words={
		"0":"",
		"1":"one", 
		"2":"two", 
		"3":"three", 
		"4":"four", 
		"5":"five", 
		"6":"six", 
		"7":"seven", 
		"8":"eight", 
		"9":"nine"},
	tens_words={
		"2": "twenty",
		"3": "thirty",
		"4": "forty",
		"5": "fifty",
		"6": "sixty",
		"7": "seventy",
		"8": "eighty",
		"9": "ninety"
	},
	teen_words={
		"10":"ten",
		"11":"eleven",
		"12":"twelve",
		"13":"thirteen",
		"14":"fourteen",
		"15":"fifteen",
		"16":"sixteen",
		"17":"seventeen",
		"18":"eighteen",
		"19":"nineteen"
	},
	bignumbers={
		"1":"",
		"2":"thousand",
		"3":"million",
		"4":"billion",
		"5":"trillion"
	};

module.exports=function toWords(number) {
    var word_segments=number.toString().split("").reverse().join("").match(/([0-9]{1,3})/g);
    // each segment needs to be reversed
    for( seg in word_segments ) {
    	//console.log(word_segments[seg].split("").reverse().join(""));
    	word_segments[seg]=word_segments[seg].split("").reverse().join("");
    }
    if( word_segments.length > 1 )
    	word_segments=word_segments.reverse();
    var segment, output_strings=[], ones_place, hundreds_place, tens_place, ones_place_match, hundreds_place_match, tens_place_match;
    for( segment in word_segments ) {
    	if( word_segments[segment].length===3 ) {
    		hundreds_place_match=word_segments[segment].match(/^([1-9])/)
    		if( hundreds_place_match ) {
	    		hundreds_place=hundreds_place_match[1];
	    		output_strings.push(ones_words[hundreds_place]);
	    		output_strings.push("hundred");
    		}
    	}
    	if( word_segments[segment].length>=2 ) {
    		tens_place_match=word_segments[segment].match(/^[1-9]{0,1}([0-9][0-9])/);
    		if( tens_place_match ) {
    			tens_place=tens_place_match[1];
    			if( tens_place.match(/^([2-9])/) ) {
	    			output_strings.push(tens_words[tens_place.match(/^([2-9])/)[1]]);
	    		}
    		}
    	}
    	if( word_segments[segment].length>=1 ) {
    		ones_place_match=word_segments[segment].match(/^[1-9]{0,1}[0-9]{0,1}([0-9])/);
    		if( ones_place_match ) {
    			ones_place=ones_place_match[1];
    			if( tens_place && tens_place.match(/^([1])/) ) {
	    			output_strings.push(teen_words[tens_place]);
	    		} else {
	    			output_strings.push(ones_words[ones_place]);
	    		}
    		}
    	}
    	output_strings.push(bignumbers[word_segments.length-segment]);
    }
    return output_strings.join(" ")
};
