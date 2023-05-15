import json
from logging import info

def result_transfer(data, x, y):

    formula_list = data['formula'].values.tolist()  
    x_list = data[x].values.tolist()  
    y_list = data[y].values.tolist()

    #The list is like [[formula,x,y],[formula,x,y]...]
    needlist=[]
    for j in range (0, len(formula_list)):
        emplist = [formula_list[j],x_list[j],y_list[j]]
        needlist.append(emplist)
    #Change into json
    jsonList = []
    for i in range (0, len(needlist)):
        aItem = {}
        aItem["material"] = needlist[i][0]
        aItem["X"] = needlist[i][1]
        aItem["Y"] = needlist[i][2]
        jsonList.append(aItem)
    jsonArr = json.dumps(jsonList, ensure_ascii=False)
    return jsonArr



def plot_results(data, xAxis, yAxis):
    plot_result = []
    for instance in result_transfer(data,xAxis,yAxis):
        plot_result.append(instance)
    info((xAxis,yAxis))
    return plot_result