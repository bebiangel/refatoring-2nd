function renderPlainText(data, plays) {
	//
	let result = `청구내역 고객명(${data.customer})\n`
	for (let perf of data.pefrormances) {
		// 청구 내역을 출력한다.
		result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석\n`
	}

	result += `총액: ${usd(totalAmount())}\n`
	result += `적립 포인트: ${totalVolumeCredits()}점\n`
	return result

	function totalAmount() {
		let totalAmount = 0
		for (let perf of data.pefrormances) {
			totalAmount += amountFor(perf)
		}
		return totalAmount
	}

	// 중첩함수
	function totalVolumeCredits() {
		let volumeCredits = 0
		for (let perf of data.pefrormances) {
			// 포인트를 적립한다.
			volumeCredits += volumeCreditsFor(perf)
		}
		return volumeCredits
	}

	function usd(aNumber) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
		}).format(aNumber / 100)
	}

	function volumeCreditsFor(aPerformance) {
		let result = 0
		result += Math.max(aPerformance.audience - 30, 0)
		// 희극 관객 5명마다 추가 포인트를 제공한다.
		if ('comedy' === aPerformance.play.type) {
			result += Math.floor(aPerformance.audience / 5)
		}
		return result
	}

	function amountFor(aPerformance) {
		let result = 0

		switch (aPerformance.play.type) {
			case 'tragedy':
				result = 40000
				if (aPerformance.audience > 30) {
					result += 1000 * (aPerformance.audience - 30)
				}
				break
			case 'comedy':
				result = 30000
				if (aPerformance.audience > 20) {
					result += 1000 * 500 * (aPerformance.audience - 20)
				}
				result += 300 * aPerformance.audience
				break
			default:
				throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`)
		}
		return result
	}
}

function statement(invoice, plays) {
	const statementData = {}
	statementData.customer = invoice.customer // 고객 데이터를 중간 데이터로 옮김
	statementData.performances = invoice.performances.map(enrichPerformance) // 고객 데이터를 중간 데이터로 옮김
	return renderPlainText(statementData, plays)

	function enrichPerformance(aPerformance) {
		const result = Object.assign({}, aPerformance) // 얕은 복사
		result.play = playFor(result)
		return result
	}

	function playFor(perf) {
		return plays[perf.playID]
	}
}
