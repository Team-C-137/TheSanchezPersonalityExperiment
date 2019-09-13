/* eslint-disable no-undef */
import { getAllTimeData } from '../../services/quiz-api.js';
const ctx = document.getElementById('all-user-stats').getContext('2d');
Chart.defaults.global.defaultFontColor = '#FFF';

getAllTimeData()
    .then(results => {
        // Maybe server should be returning data in more usable format? result.result?
        // Time for aggregation SQL! Then you wouldn't need to do any of this...

        // This is a reduce operation.
        return results.reduce((data, result) => {
            const label = result.result;
            if(label) {
                data[label] = (data[label] || 0) + 1;
            }
            return data;
        }, {});
    })
    // return value from previous then, no need for outer variable
    .then(data => {

        const labels = Object.keys(data);
        const chartData = Object.values(data);

        // don't use a variable if you don't need it...
        new Chart(ctx, {
            type: 'horizontalBar',
            defaultFontColor: 'white',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sanchez Personality Experiment Assessments',
                    backgroundColor: 'green',
                    data: chartData
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scaleFontColor: '#FFFFFF',
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontFamily: 'adult-swim-font',
                            stepSize: 1,
                        }
                    }]
                }
            }
        });
    });