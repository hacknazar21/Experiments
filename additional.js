function getRandomBetween(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}
function getNewRange(old_min, old_max, new_min, new_max, old) {
	old_range = old_max - old_min;
	new_range = new_max - new_min;
	return (((old - old_min) * new_range) / old_range) + new_min;
}