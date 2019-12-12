import csv

file = open('./street-slot 2.csv', newline='\n')
street_slot = open('./street-slot.csv', 'w+')

with file as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        out = []
        out.append(row[0].lower().replace(',', ''))
        out.append(row[0].lower().replace(',', ''))
        out.append(row[2].lower().replace(',', ''))
        if 'calle' in out[0]:
            out.append(row[3].lower().replace(',', ''))
        new_row = '"' + '","'.join(out) + '"\n'
        street_slot.write(new_row)
    street_slot.close()

from more_itertools import unique_everseen
with open('./street-slot.csv', 'r') as f, open('street_names_out.csv', 'w+') as out_file:
    out_file.writelines(unique_everseen(f))

print("Done my man!!!!")
