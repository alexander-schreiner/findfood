import Star from "./star";

export default function Rating({ stars }) {
    const fullDigitStars = Math.round(stars);
    return (
        <>
            {
                Array.from({ length: fullDigitStars })
                    .map((_, index) => (
                        <Star golden key={index} />
                    ))
            }
            {
                Array.from({ length: 5 - fullDigitStars })
                    .map((_, index) => (
                        <Star key={index} />
                    ))
            }
        </>
    );
}
