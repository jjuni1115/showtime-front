const TextHighlighter = ({text, keyword}) => {


    if (!keyword) return text;


    const parts = text.split(new RegExp(`(${keyword})`, 'gi'))


    return (

        <span>
            {parts.map((part, idx) =>
                part.toLowerCase() === keyword.toLowerCase() ? (
                    <span key={idx} style={{backgroundColor: 'yellow'}}>{part}</span>
                ) : (
                    part
                )
            )}
        </span>

    )


}

export default TextHighlighter;
