const { MongoClient } = require('mongodb');
const { performance } = require('perf_hooks');

// Replace with your actual MongoDB connection string
const { mongoURI, databaseName, collectionName } = require('./config');

// Define the aggregate query
const pipeline = [
  {
    "$vectorSearch": {
      "index": "vectorSearchIndex",
      "path": "plot_embedding",
      "queryVector": [0.024552748,-0.015502235,-0.013485263,0.012069505,-0.0027216184,0.023427898,-0.011920818,-0.03865862,0.0058472776,-0.026013758,-0.009069907,0.010834756,0.0065680863,-0.03470225,0.025936183,0.011164454,0.029918408,-0.0045866705,0.0134723345,-0.020376582,-0.014519608,0.02301416,0.007589501,0.0038464677,0.0022254563,-0.0034812149,0.022677999,-0.009651725,0.011772131,0.0113842515,-0.004790307,-0.029633963,0.008022632,-0.016407287,-0.025535375,-0.02173416,-0.004622226,-0.01448082,0.0061737425,-0.009334957,0.004237579,0.009367281,-0.021475572,0.006141419,0.00014464658,0.0046254583,-0.019743046,-0.002291719,-0.0166788,0.020066278,0.0202085,-0.0015983852,-0.02229012,-0.0017195974,-0.020842036,0.0098391995,0.0041244477,0.0018327287,0.01335597,-0.012780616,-0.010162433,-0.0008165663,-0.013989506,-0.012955162,-0.018708702,-0.0038303062,-0.00789334,0.0051587922,0.0036331343,-0.0010270715,0.03190952,0.0055628326,0.012825869,0.00020707087,0.015256578,-0.02133335,-0.023958,-0.0058763684,0.012625465,0.020389512,0.018346682,-0.031831946,-0.008701421,0.032918006,0.012890516,0.0026521233,-0.015489305,0.03452124,-0.018631127,-0.00096404116,0.020156784,0.0146489,0.011106271,0.009897382,0.018450117,-0.011836777,-0.0072921272,0.036305483,-0.0044606095,-0.013265465,-0.019924056,0.017234761,-0.011694555,-0.0025454566,-0.030487297,-0.019678399,0.020893754,0.0038400032,0.037857,0.007938593,-0.03299558,-0.010744251,0.017170114,-0.045692157,-0.0065939445,-0.0070400056,0.005911924,0.019019006,-0.002708689,0.00074545515,0.029194366,0.0036492958,0.0063321264,-0.018488904,-0.0012064656,0.0022997998,-0.004011316,-0.011345464,-0.012612536,-0.027616993,-0.0066327327,-0.008565663,0.025729313,-0.0094771795,-0.025406081,0.03043558,-0.032581843,0.004004852,-0.021449715,0.0038561646,0.0073761675,0.019626683,-0.019316379,-0.009612937,0.013924859,0.018282035,0.006597177,0.0005672732,0.0037591949,-0.015450518,0.023854565,-0.03247841,0.014778194,-0.008358794,0.028677195,0.0019975773,-0.015295366,0.018049307,-0.040313568,-0.0056177825,0.007589501,0.021307493,0.0014505063,-0.013924859,0.0138343545,0.016213346,0.0040921243,-0.005029499,-0.010698998,0.00036343464,-0.002519598,0.032064673,-0.023583049,0.013252536,-0.0026198002,0.017493347,-0.01854062,0.037546698,-0.0129034445,-0.008875967,0.0037979828,0.0008064653,0.0027701033,0.013278395,-0.035865888,-0.011856171,-0.028185882,-0.0021963655,-0.0003739397,0.0054593985,-0.00042828318,-0.004583438,-0.0025955576,0.0019620217,-0.6855634,-0.011164454,0.017415771,-0.024940627,3.7828315E-05,0.016717589,0.021682441,0.009244452,-0.020880826,-0.004583438,0.0027652548,0.016989104,0.0015595972,0.0037850535,-0.022820221,-0.01354991,0.014131729,-0.033874776,0.014933346,-0.014571325,-0.015747892,0.031107904,0.0043733367,-0.014222234,-0.010162433,0.031599216,0.0147652645,0.0011773747,-0.013233142,0.027125679,-0.030694166,0.029582245,0.0031563663,0.015670316,0.04729539,0.00993617,-0.027616993,0.01912244,0.0068977834,0.030306287,-0.03576245,0.00077818247,0.014623042,0.0048387917,0.0025050526,-0.0053947517,0.006538995,-0.0013511122,0.0112291,0.018863853,0.0073826322,0.0127224345,0.006519601,-0.00945132,0.029168509,-0.0059959646,0.024591535,0.01168809,0.008895361,0.0028105073,-0.012334555,0.017118398,-0.0181786,0.008766068,-0.01243799,0.027487699,-0.002164042,0.022522846,0.016277993,-0.023117594,0.025574163,0.039434377,-0.0036492958,0.0011393948,0.009031119,-0.00557253,0.020622239,0.02022143,-0.0058860653,-0.0062674796,0.0033745482,-0.022923656,-0.03361619,-0.02707396,0.033693764,-0.026401637,0.0051135393,0.014442032,0.0028169719,-0.0015208093,-0.0069624297,0.0118820295,-0.0042505083,-0.0057987925,0.012884051,-0.0047547515,-0.008332936,0.02337618,0.018139813,-0.04251155,0.013181425,-0.007835158,0.015385871,-0.012075969,-0.015075568,0.0007878794,-0.028289316,-0.0026602042,0.026660224,-0.022755574,0.0067426316,-0.012088899,0.009457786,-0.009781018,-0.013705062,-0.022548705,0.031857803,0.0050618225,0.024604464,-0.017157186,0.01373092,0.017170114,0.0025955576,-0.0024371736,0.0155151645,0.0020783856,-0.014739406,-0.009625866,-0.027332548,0.008559199,-0.004793539,0.025069918,0.005265459,-0.009955564,-0.008972936,-0.010698998,0.017596781,-0.0067103086,0.036434777,-0.018101025,-0.022419412,0.015980618,0.010155967,-0.016989104,-0.005582227,-0.018463045,-0.013588698,-0.014390315,-0.0363572,-0.008404047,-0.008895361,-0.017338196,-0.008216572,-0.015799608,0.0019911127,0.007537784,0.01214708,-0.0014690921,-0.015036779,-0.005666267,0.031237196,0.0028816184,-0.005970106,-0.004719196,-0.022975372,-0.011675161,-0.0056501054,0.023789918,0.0046577817,-0.020984259,-0.016963245,-0.023970928,-0.020570522,0.023608908,0.0036880837,0.008436371,-0.010492129,0.006144651,-0.021449715,-0.009141018,-0.004803236,-0.004670711,0.003384245,0.009250917,0.004670711,-0.012237586,0.015553952,-2.7247497E-05,-0.0038917202,0.010000817,0.0020299007,0.038270738,0.02209618,-0.0042892965,0.00478061,-0.00046868724,0.020648098,0.003145053,0.004185862,0.013459405,0.015696174,-0.025936183,0.02691881,-0.018656984,0.011157989,-0.023906281,0.01104809,-0.022820221,0.017402843,0.001338991,0.006144651,-0.033874776,-0.008177784,-0.010246473,-0.007822229,0.009574149,0.015541023,0.013142637,-0.008410512,-0.002311113,-0.016963245,-0.021216987,-0.0019959612,0.0073373797,0.0025276789,-0.00039616192,-0.0053010145,-0.008061421,0.019096581,-0.016303852,-0.011694555,-0.016833954,-0.004929297,0.035478007,0.003006063,-0.03656407,-0.0011636373,-0.02377699,0.033848915,9.106068E-05,0.007537784,0.02430709,0.018980218,-0.027823862,-0.008035562,-0.018514762,0.017364055,0.010653746,-0.009761624,-0.00788041,-0.030280428,-0.0054529337,0.00024969716,0.023453757,0.005566065,-0.010485665,0.017402843,-0.003959599,0.025354363,0.0401067,0.00788041,-0.0025777798,0.00575354,0.0040501044,-0.0045252563,-0.004027478,0.0023692949,0.0010456574,-0.0066521266,-0.016277993,-0.012399202,-0.004176165,0.007705865,-0.009690513,0.018954359,0.0075119254,-0.016536579,0.0010828292,0.013873142,0.01948446,0.001221011,-0.020880826,0.024785474,0.0011434352,-0.023453757,-0.006070308,-0.020286078,-0.0018812136,-0.012050111,0.012528495,0.019187085,-0.0058957622,0.0031660632,0.011151524,0.0118820295,0.008423441,0.0181786,-0.011267887,0.0204283,0.009826271,-0.00807435,0.002707073,-0.013116778,-0.011539403,0.0068137427,0.00047393978,-0.016652944,-0.008753139,-0.0056371763,-0.010556776,-0.008520411,-0.008197178,-0.0041826298,-0.0046060644,-0.014907487,0.004929297,0.003471518,0.011073948,0.02560002,0.0053042467,-0.0048290947,-0.030125277,-0.014015364,0.0047547515,0.1075718,-0.0020767692,0.0059959646,0.012192333,0.0024129313,-0.010666675,-0.025238,-0.0052460646,0.009069907,0.014610113,0.025755173,-0.010349907,0.013265465,0.01446789,-0.004800004,0.015437588,-0.013233142,-0.015256578,-0.00881132,-0.0075830366,2.77778E-05,0.00014272738,0.029530529,-0.0007846471,-0.013485263,-0.025509516,-0.0047385897,0.019949915,-0.00992324,-0.0026602042,-0.007550713,-0.021591937,-0.004929297,0.015657386,0.0021365674,0.00742142,0.0122246565,0.008604451,0.031392347,-0.02581982,0.039667103,0.025522444,0.013808496,-0.01985941,0.024242444,0.007970915,0.00046949534,0.027720427,0.022548705,-0.013149101,0.06568086,0.009108694,0.01987234,-0.00303677,0.023350323,0.0066391975,0.0036525282,0.01819153,-0.005536974,0.0055434387,-0.008429905,-0.027875578,0.0030028308,-0.0058763684,0.015204861,-0.03247841,-0.02244527,0.011558797,-0.013860214,-0.009166876,-0.017325267,-0.045174986,-0.0156056695,-0.026233556,0.011274353,0.015243649,0.009619402,-0.020699814,-0.017027892,0.01594183,-5.6111156E-05,-0.022303049,0.014610113,0.0024872748,-0.0035684877,0.015049709,0.02004042,0.017351124,-0.013627485,0.013394758,0.009709907,0.023104666,0.007001218,-0.023996787,0.008358794,0.012179404,0.012534959,0.007001218,-0.020156784,0.013394758,0.023272745,-0.036072757,-0.017428702,-0.019962844,0.017907085,-0.021798806,-0.00945132,0.0068266722,-0.018669914,-0.021837594,0.006138187,-0.002755558,0.01929052,0.0030238407,-0.004425054,0.012172939,0.010492129,0.018113954,0.00732445,-0.017674359,0.0034650534,-0.012968091,0.018450117,0.015734963,-0.024151938,0.0027636385,0.009554755,-0.019911127,-0.0053301053,-0.008656168,-0.013065061,0.012644859,-0.0025341434,-0.007408491,-0.031444065,-0.0034585886,-0.0020622239,0.010776575,-0.008320007,-0.010194756,-0.005675964,0.0061640455,-0.015075568,-0.030694166,-0.004880812,-0.02040244,-0.0032694975,-0.020273147,-0.009250917,0.032918006,0.00010626271,0.0017066681,0.005407681,0.024229515,-0.007111117,-0.027513558,-0.02968568,-0.0033357602,0.013026273,0.002191517,0.030306287,-0.00073575816,0.0025777798,-0.010220614,-0.005045661,0.005666267,-0.0061769746,-0.018760419,-0.034236796,0.016277993,0.0037139424,0.02209618,-0.0026892952,-0.022820221,0.005019802,0.016368497,-0.00044080845,-0.021229915,-0.0018989914,-0.024436383,-0.005905459,-0.007970915,-0.008649704,0.025483657,0.011410111,-0.0075119254,0.028030729,5.5909135E-05,0.0010682837,-0.008048492,0.03436609,-0.004977782,-0.00039535385,-0.0017325267,-0.009535361,-0.009322028,0.01085415,-0.01521779,-0.022871938,0.003940205,0.013110314,-0.005349499,0.0065907123,0.0045414176,0.005915156,0.031625077,0.004942226,-0.030539015,0.0034779827,-0.021023048,-0.019885268,-0.031625077,-0.0029591944,-0.0145842545,-0.0016775772,-0.010285261,-0.024345879,0.017557994,-0.027487699,-0.02616891,-0.010336978,-0.007182228,0.020324865,0.028496185,0.0076800063,0.022018604,-0.027901437,-0.0016307083,0.017325267,0.0011620212,-0.0017212135,0.009056977,0.00724041,-0.01466183,0.0024355575,-0.0046286904,0.003115962,-0.034081645,-0.019355167,0.012127686,0.029892549,0.0118820295,-0.020337794,-0.004496165,0.0033486895,0.021811735,-0.020854967,-0.0020864664,-0.012696576,7.9697034E-05,-0.018915571,-0.009263846,0.010976979,0.013136173,-0.0008000006,0.004017781,0.0017292943,-0.019988703,-0.0029301033,0.00011676777,0.00097535434,0.041322052,-0.0104080895,-0.0018456581,0.00012444454,-0.00084525323,-0.007311521,0.013705062,0.0012169707,0.0307976,0.011242029,0.0074537434,-0.012955162,0.025923254,0.013627485,0.01020122,-0.002600406,-0.0032032349,-0.008837179,0.0016105063,0.0146489,0.014377385,-0.022367695,-0.013769708,-0.018579409,-0.0063385908,-0.014312739,-0.015825467,-0.004871115,-0.009884452,-0.008481623,-0.001002829,-0.009360815,0.01984648,0.010356372,0.009153947,0.0011442434,0.029427094,-0.031806085,0.004948691,0.00732445,-0.0044993977,-0.006538995,0.014442032,0.018708702,-0.025522444,0.0018472743,-0.00040686902,-0.019432742,-0.014222234,-0.0020573754,-0.0068913186,-0.0047385897,-0.032788713,-0.0042181853,0.0030626287,-0.004483236,-0.035891745,-0.02190224,0.018437186,0.00022747493,-0.0063418234,0.018889712,0.0002092931,0.0307976,-0.0030416185,0.014273951,0.013963647,-0.0023078807,-0.011080413,-0.006063843,0.012793546,-0.010401624,-0.009858594,0.00047798018,-0.014635972,-0.008798391,0.01559274,0.0028218206,-0.004105054,-0.0045769736,0.032349117,0.00881132,0.016989104,0.010155967,0.016096983,-1.900254E-05,-0.022703856,-0.019497389,-0.014222234,0.004337781,0.03193538,-0.009709907,-0.007873946,-0.028651336,-0.0006113136,-0.02134628,-0.0070981877,-0.008300613,0.020441229,0.026815375,0.011707484,-0.00010232331,0.002957578,-0.0040727304,0.01649779,-0.033280026,-5.7020246E-05,-0.00398869,0.012955162,0.0045478824,0.02338911,-0.039563667,-0.0072080866,0.008164855,0.015140214,-0.018113954,0.009160412,-0.034598816,-0.01912244,-0.032064673,-0.0065842476,-0.0107701095,-0.004483236,0.01290991,-0.009696977,-0.0006303035,-0.0016953549,0.0041018217,-0.009729301,0.001120001,0.013601627,0.011242029,0.02911679,-0.005734146,-0.0068589956,0.007052935,-0.0128129395,0.015502235,0.0036331343,0.009457786,0.01910951,0.013937789,-0.021514362,-0.014700618,-0.0012492939,0.0052525294,-0.02002749,0.0043701045,-0.009179805,0.0023191937,-0.019833552,-0.015864255,-0.015295366,-0.014416173,-0.0034909118,0.014054153,-0.022419412,0.027591133,0.012625465,-0.030099418,0.012366879,0.004205256,-0.006603642,-0.0031353561,-0.02359598,-0.010039604,-0.002807275,0.00603152,-0.007789905,-0.0025842446,0.008714351,0.00714344,-0.00432162,-0.030409722,0.026052546,0.24493273,-0.008882431,-0.009587078,0.014558395,-0.0035846494,0.011267887,0.031599216,0.0009317179,-0.015204861,-0.008423441,-0.031288914,0.010194756,0.0009713139,0.0027523255,-0.010647281,-0.036150333,-0.035555582,-0.0086367745,-0.022057392,-0.024022646,-0.004046872,-0.010336978,0.0026440425,-0.016627084,0.02023436,-0.009787482,-0.0051555596,0.006852531,0.02002749,0.014791123,0.01410587,-0.025483657,-0.005921621,0.0052816207,-0.0057018227,-0.01728648,0.011487686,0.0042602057,0.0034553562,0.019704258,0.010065462,0.01224405,-0.009250917,0.022846079,0.0014933345,0.030306287,-0.016394356,0.010873544,0.00063434395,0.018501833,-0.026841234,-0.014067082,0.027487699,0.029090934,-0.011720413,0.012993949,0.017739004,0.01002021,-0.023156382,-0.007537784,0.0010731322,0.019368097,-0.006151116,0.034004066,-0.025651738,0.021087693,-0.023466686,-0.0057890955,-0.0005288893,-0.0024824264,-0.009406068,-0.0069624297,0.0004985863,0.0005692934,-0.0034553562,-0.015243649,0.031263057,0.0004654549,0.014791123,0.0024468706,-0.023789918,0.013860214,-0.00454465,-0.01446789,-0.0023127291,-0.047941856,0.009929705,-0.008384653,-0.0202085,-0.007919198,0.014118799,-0.0010076776,0.011862636,-0.006529298,0.004670711,0.031418208,-0.016937388,0.021979816,-0.008106673,0.019523248,-0.019975774,-0.025470728,0.0073050563,0.0065648537,-0.024604464,0.013304253,0.008184249,0.005207277,0.014816982,0.00329374,0.0008759603,-0.019936986,-0.0054690954,0.0015313143,-0.0072145513,0.01114506,0.02691881,-0.006762026,-0.014597183,-0.009813341,-0.002092931,0.0004711115,-0.021397997,0.012470313,0.0036557605,-0.02412608,0.0009204048,-0.00016787893,0.013937789,-0.01782951,0.0061737425,-0.032581843,0.007492531,0.007899804,-0.0034165685,0.031211339,0.010168897,-0.02618184,-0.012011323,0.025005274,0.019070722,0.0068396013,0.0028185882,-0.00482263,0.0053721257,-0.019730117,-0.0021187896,0.008151926,-0.015114356,-0.0017325267,-0.029892549,-0.027798003,-0.00817132,0.002411315,0.0363572,-0.018514762,-0.057664692,-0.030358003,-0.0020638402,0.035219423,-0.030461438,0.0045252563,0.006833137,0.00034484876,0.00042343469,0.0054593985,-0.16590883,0.008080815,0.0055402066,-0.015036779,0.028832346,0.008927684,0.010414554,-0.008106673,-0.018346682,-0.00052242464,0.015825467,0.008223037,-0.040184274,0.01242506,0.0014294961,0.00853334,-0.01816567,0.02059638,0.026298203,0.008248895,0.0042408113,-0.006613339,0.0066521266,-0.02024729,0.024888908,0.027513558,0.018773349,-0.0114295045,-0.0032274774,-0.00472566,-0.0046092966,0.0012113141,0.009684049,-0.012948697,0.03576245,-0.015502235,-0.017014964,-0.0063127326,0.010227079,0.0066391975,0.013200819,0.0017632338,0.0040016193,-0.0027248508,-0.0026149517,0.027410123,-0.0031353561,-0.003006063,-0.0065616216,-0.0036428312,0.0061866716,-0.014985062,0.007938593,-0.010537382,0.0098391995,0.02893578,0.014312739,0.0121341515,0.003859397,-0.020441229,0.003195154,-0.021966886,0.005288085,0.027487699,-0.0021559612,-0.019238804,0.00048202058,0.016989104,-0.029194366,0.0046933373,-0.031392347,-0.007899804,0.015903043,-0.02393214,0.01095112,-0.022794362,-0.0005907075,0.0046739434,0.0026957598,-0.0066521266,-0.020505875,0.042951144,-0.026285274,0.00087838457,0.013420617,-0.007221016,-0.0032290935,-0.008863037,-0.010130109,0.010634352,0.012651323,-0.026285274,0.027306689,-0.020867895,0.016122842,0.026686082,0.005365661,0.00058545504,0.030487297,-0.010175361,0.0030626287,-0.020842036,-0.017234761,0.0029818206,0.025548303,0.0022270726,0.030280428,-0.002766871,0.02247113,-0.014597183,-0.003581417,0.0067232377,0.010964049,0.0008290916,-0.0070270766,0.005514348,0.014403244,-0.008223037,0.02709982,-0.020661026,0.044011347,0.009496573,-0.028185882,-0.013717991,0.0045187916,0.0074149556,-0.10503766,-0.0014642436,-0.01894143,0.008856573,-0.028496185,-0.0057050553,-0.013808496,-0.0029010125,0.01132607,0.009011724,0.018708702,-0.013026273,0.0071240463,-0.011985464,0.014739406,-0.0017923247,-0.02950467,-0.018656984,0.006852531,0.008003239,-0.004631923,-0.0018876783,-0.012728899,-0.023828706,-0.014829911,-0.0064711166,-0.02896164,0.006613339,0.013705062,0.014610113,0.009677583,-0.025677597,0.010996372,-0.023104666,-0.0007701016,0.014545467,-0.027151536,0.00882425,0.023906281,-0.04158064,0.0056468733,-0.018023448,0.008481623,-0.0017438398,-0.0075119254,0.017208902,-0.011823848,0.0015959609,0.007149905,-0.019730117,-0.026505072,-0.0075183897,-0.01168809,-0.0059862672,0.033228308,-0.007886875,0.018695774,0.005747075,-0.001696971,0.005178186,-0.0019490925,-0.019200016,-0.00993617,0.02466911,0.016277993,-0.01335597,-0.0066715204,0.020635169,0.032555986,-0.0012072737,-0.00945132,0.01984648,-0.0025567696,0.027616993,-0.028444467,0.0161487,-0.019264663,-0.014920416,0.01781658,-0.026466284,0.003044851,-0.031625077,0.023673555,-0.013071526,0.023182241,-0.018993147,0.021048905,-0.005317176,0.0027523255,-0.003610508,0.0049971757,0.0033648512,-0.0056080855,-0.020156784,-0.0066521266,0.011778595,-0.011545868,-0.028987499,0.00464162,-0.0028315175,-0.009141018,-0.0016727286,-0.05849217,0.01801052,0.02023436,-0.006477581,0.00074505113,-0.020066278,0.024087293,0.0017745469,0.007369703,-0.005979803,-0.0033551543,0.028237598,0.019316379,0.007841622,0.009425462,-0.030358003,-0.00487758,-0.0040501044,0.0011967686,-0.0014901023,-0.0047450545,0.005905459,0.012981021,0.020997189,-0.02060931,0.0026117193,-0.022587493,0.011675161,-1.9671734E-05,-0.009632331,0.006367682,-0.032555986,0.012121222,-0.0041535385,0.0018133348,-0.013317183,-0.009884452,0.020803249,0.018023448,0.044787105,-0.02262628,-0.017557994,0.0168986,-0.0020557593,-0.009490109,0.012211727,-0.0077446527,0.0035878818,0.037003666,-0.0059183887,0.026013758,0.011901423,-0.0023143452,-0.023531333,-0.008048492,-0.027953153,0.022393553,-0.01448082,-0.025949111,-0.020725673,0.008714351,0.009044047,0.0063095,0.025380222,0.022432342,-0.011823848,0.012793546,-0.008229502,-0.010181827,-0.020467088,-0.0015313143,-0.0035587908,0.0014012132,0.014752335,-0.008320007,0.015747892,-0.022018604,-0.009865059,-0.0052525294,0.043028723,-0.008863037,0.004800004,-0.04923479,0.015747892,0.009121624,0.023156382,-0.022005673,0.011358393,-0.0095224315,-0.0010602028,0.013330112,0.008307077,0.023350323,1.0486119E-05,0.0051587922,0.019471532,-0.008785462,-0.0012541424,0.022109108,0.0057987925,-0.010970514,-0.001597577,-0.0040436396,-0.030668307,-0.0050650546,0.004066266,-0.023958,-0.030461438,-0.0015983852,0.015903043,-0.0049195997,-0.010259402,-0.006677985,0.010168897,-0.011371322,0.0029107095,-0.0052913176,-0.029194366,-0.008313542,0.01634264,-0.0050230343,0.016433144,0.016019408,-0.0124961715,0.013058596,0.012211727,0.027487699,0.00394667,-0.0078028347,0.0008290916,0.011487686,-0.016730519,-0.028004872,0.008662634,0.0061737425,-0.00676849,-0.0060993987,0.0029737398,-0.031599216,0.04437337,0.019368097,0.0008937381,0.010686069,-0.023052948,0.021850523,0.008669098,0.02932366,-0.0156056695,-0.018230317,-0.0020412137,-0.02968568,0.030487297,0.012890516,-0.021204058,0.022160826,-0.029065074,0.009580614,0.004295761,-0.0051814183,0.023893353,0.0076218243,0.033383463,-0.0010052533,-0.023440827,-0.016096983,-0.01103516,-0.009199199,-0.0023434362,-0.004476771,0.0068202075,0.0057793986,-0.0224582,-0.0057082875,0.026660224,-0.0077640465,-0.0030125277,-0.008585057,0.0134723345,0.010511524,-0.0033195987,0.010033139,-0.014920416,0.010505059,0.0037268717,0.019342238,0.003461821,-0.015851326,-0.033900633],
      "numCandidates": 150,
      "limit": 10
    }
  }
];

// Function to run the benchmark
async function benchmark(workerCount) {
  const TARGET_QUERY = 5000;
  //const TARGET_QUERY = 10000;
  
  const workerLoop = Math.ceil( TARGET_QUERY / workerCount );
  const actualQuery = workerLoop * workerCount;

  console.log(`Target query: ${TARGET_QUERY}`);
  console.log(`Worker threads: ${workerCount}`);
  console.log(`Actual query: ${actualQuery}`);
  console.log(`Query per worker: ${workerLoop}`);
  
  const currentDate = new Date();
  console.log(`Current: ${currentDate}`)

  const client = new MongoClient( mongoURI, maxPoolSize=10 );
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);

  
  const startTime = performance.now();

  // Run the query in parallel worker threads
  const results = await Promise.all(
    Array.from({ length: workerCount }, async (_, i) => {
      for (let j = 0; j < workerLoop; j++) {
        await collection.aggregate(pipeline).toArray();
      }
      return i;
    })
  );

  const endTime = performance.now();

  console.log(`Elasped time: ${(endTime - startTime) / 1000} seconds`);
  //console.log(`Average TPS: ${( actualQuery/ ((endTime - startTime) / 1000) )} QPS`);
  //console.log(`Average time per query: ${(endTime - startTime) / (actualQuery)} milliseconds`);

  await client.close();
}

benchmark(50);
