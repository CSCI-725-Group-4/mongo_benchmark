import matplotlib.pyplot as plt
import numpy as np
import itertools

def draw_plot(x_s, y_s, bar_width=0.25, padding=0.5, legend=True):
    x = np.arange(len(x_s))

    # Create the bar chart with three sets of bars
    for y in y_s:
        if bar_width:
            plt.bar(x + (bar_width * y[2]), y[0], width=bar_width, label=y[1])
        else:
            plt.bar(x_s, y[0])

    # Add labels, title, and legend
    # plt.xlabel('Queries')
    plt.ylabel('Time (minutes)')
    plt.title('Query Execution Times')

    if bar_width:
        plt.xticks(x, x_s)

    if legend:
        plt.legend()

    if padding:
        plt.xlim(-padding, len(x_s) - 1 + padding)

    # Show the plot
    plt.show()

# Sample data for query execution times
queries_1_thru_10 = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10']

mongo_1_thru_10 = [2.33,   2.49,   1.1,    1.11,   0.99,   1.01,   1.02,   1.07,   1.09,   1]
pgsql_1_thru_10 = [1.527,1.244,0.517,0.447,0.402,0.678,0.707,0.4,0.439,0.526]
sinew_1_thru_10 = [0.842,0.949,0.91,0.943,0.819,0.0,0.0,1.014,0.0,0.749]

query_11 = ['Q11']

mongo_11 = [18.08]
pgsql_11= [13.83]
sinew_11 = [0]

draw_plot(queries_1_thru_10, [(mongo_1_thru_10, "Mongo", -1), (pgsql_1_thru_10, "PGSQL", 0), (sinew_1_thru_10, "Sinew", 1)], padding=None)
draw_plot(query_11, [(mongo_11, "Mongo", -1), (pgsql_11, "PGSQL", 0), (sinew_11, "Sinew", 1)])

draw_plot(list(itertools.chain(queries_1_thru_10, query_11)), [(list(itertools.chain(sinew_1_thru_10, sinew_11)), "Sinew", 0)], padding=None, legend=False, bar_width=None)
# draw_plot(list(itertools.chain(queries_1_thru_10, query_11)), [(list(itertools.chain(pgsql_1_thru_10, pgsql_11)), "PGSQL", 0)], padding=None, legend=False, bar_width=None)
# draw_plot(list(itertools.chain(queries_1_thru_10, query_11)), [(list(itertools.chain(mongo_1_thru_10, mongo_11)), "Mongo", 0)], padding=None, legend=False, bar_width=None)