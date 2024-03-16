from reference_parser import parse_references
text = "(изм. - ДВ, бр. 101 от 2013 г., в сила от 01.01.2014 г.) фактическото предоставяне на стока по договор за лизинг, в който изрично е предвидено прехвърляне на правото на собственост върху стоката; тази разпоредба се прилага и когато в договора за лизинг е уговорена само опция за прехвърляне на собствеността върху стоката и сборът от дължимите вноски по договора за лизинг, с изключение на лихвата по чл. 46, ал. 1, т. 1, е идентичен с пазарната цена на стоката към датата на предоставянето;"
print(parse_references(text))